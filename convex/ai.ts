import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import { auth } from "./auth";
import { GoogleGenerativeAI } from "@google/generative-ai";

function shapesToPrompt(shapes: any[]) {
  return shapes.map(s =>
    `- ${s.type} at (${s.x}, ${s.y}) dimensions ${s.width}x${s.height} color ${s.fill || "transparent"} content: "${s.content || ""}"`
  ).join("\n");
}

export const generateUI = action({
  args: {
    projectId: v.id("projects"),
    shapes: v.any(),
    imageUrls: v.optional(v.array(v.string())),
    prompt: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY; // Support both
    const shapesText = shapesToPrompt(Object.values(args.shapes));

    // Fallback Mock if no key
    if (!apiKey) {
      console.log("⚠️ No Gemini/Google API Key found. Using Mock Response.");
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        code: `export default function GeneratedComponent() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl border border-neutral-100 max-w-md mx-auto mt-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
        <div>
          <h2 className="text-xl font-bold text-neutral-800">Mock AI Component (Gemini Optimized)</h2>
          <p className="text-neutral-500">Add GOOGLE_API_KEY to see real magic.</p>
        </div>
      </div>
      <div className="mt-6 h-32 bg-neutral-50 rounded-lg flex items-center justify-center text-neutral-400">
        Content based on ${Object.keys(args.shapes).length} shapes. <br/>
        ${args.imageUrls?.length ? `Analyzed ${args.imageUrls.length} mood board images.` : "No mood board images."}
      </div>
    </div>
  );
}`
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash which supports vision
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Fetch Project Data for Style Guide (if projectId provided)
    // We aren't strictly requiring it in the action args to fetch styles,
    // but we should to enable the feature. 

    let styleGuidePrompt = "";
    const project = await ctx.runQuery(api.projects.getProject, { projectId: args.projectId });
    // wait, we can't call runQuery inside action easily unless we use 'ctx.runQuery'. 
    // Convex Actions run in separate isolated environment. They CAN call queries.
    // But 'getProject' checks auth. Auth might be tricky in internal call?
    // Actually, 'auth.getUserId(ctx)' works in actions.

    // Let's rely on the client passing it OR fetch it here.
    // Fetching here is better for consistency.

    if (project && project.styleGuide) {
      styleGuidePrompt = `
             STYLE GUIDE:
             - Primary Color: ${project.styleGuide.primaryColor || "default"}
             - Font Family: ${project.styleGuide.fontFamily || "default"}
             - Border Radius: ${project.styleGuide.borderRadius || "default"}
             
             Use these styles strictly.
             `;
    }

    const prompt = `
        You are an expert UI Engineer using React, TailwindCSS, and Lucide React.
        
        GOAL: Convert the following wireframe shapes into a production-ready React component.
        
        SHAPES_DATA:
        ${shapesText}
        
        ${styleGuidePrompt}
        
        USER_PROMPT: ${args.prompt || "Modern, clean design."}
        
        RULES:
        1. Return ONLY the code. No markdown backticks.
        2. Use 'lucide-react' for icons.
        3. Use Tailwind CSS for styling.
        4. The component must be exported as default.
        5. Interpret "Rectangle" as containers, cards, or sections.
        6. Interpret "Ellipse" as avatars, icon buttons, or badges.
        7. If a shape has "content", use it as text.
        8. Make it look premium and polished.
        ${args.imageUrls && args.imageUrls.length > 0 ? "9. ANALYZE the attached images for color palette, typography, and vibe. Mimic their style in the generated code." : ""}
        `;

    try {
      let result;
      if (args.imageUrls && args.imageUrls.length > 0) {
        // Fetch images and convert to base64 or passed as inputs if supported by SDK helpers?
        // Gemini SDK expects Part objects for images. 
        // We need to fetch the image URLs and convert to data. 
        // Since this is server-side action, we can fetch.

        const imageParts = await Promise.all(args.imageUrls.map(async (url) => {
          const response = await fetch(url);
          const buffer = await response.arrayBuffer();
          return {
            inlineData: {
              data: Buffer.from(buffer).toString("base64"),
              mimeType: response.headers.get("content-type") || "image/jpeg"
            }
          };
        }));

        result = await model.generateContent([prompt, ...imageParts]);
      } else {
        result = await model.generateContent(prompt);
      }

      const response = await result.response;
      let text = response.text();

      // Clean markdown
      text = text.replace(/```tsx|```jsx|```/g, "").trim();

      return { code: text };
    } catch (e: any) {
      console.error("Gemini Error:", e);
      throw new Error("Failed to generate UI with Gemini: " + e.message);
    }
  },
});
