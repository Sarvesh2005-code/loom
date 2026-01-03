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
    projectId: v.optional(v.id("projects")),
    shapes: v.optional(v.any()),
    imageUrls: v.optional(v.array(v.string())),
    prompt: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY; // Support both
    const shapes = args.shapes || {};
    const shapesText = shapesToPrompt(Object.values(shapes));

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
        Content based on ${Object.keys(shapes).length} shapes. <br/>
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
    if (args.projectId) {
      const project = await ctx.runQuery(api.projects.getProject, { projectId: args.projectId });
      if (project && project.styleGuide) {
        styleGuidePrompt = `
                 STYLE GUIDE:
                 - Primary Color: ${project.styleGuide.primaryColor || "default"}
                 - Font Family: ${project.styleGuide.fontFamily || "default"}
                 - Border Radius: ${project.styleGuide.borderRadius || "default"}
                 
                 Use these styles strictly.
                 `;
      }
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

export const refineShapes = action({
  args: {
    projectId: v.id("projects"),
    shapes: v.any(), // Current shapes
    selectedShapeIds: v.array(v.string()), // IDs of shapes user wants to modify (or empty for global)
    prompt: v.string(), // "Make buttons blue", "Align everything left"
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    // Fallback Mock
    if (!apiKey) {
      console.log("⚠️ No Gemini/Google API Key found for refinement. Returning mocks.");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Mock logic: just change color of selected shapes to a "refined" color
      const newShapes = { ...args.shapes };
      if (args.selectedShapeIds.length > 0) {
        args.selectedShapeIds.forEach((id: string) => {
          if (newShapes[id]) {
            newShapes[id] = { ...newShapes[id], fill: "#4f46e5" }; // Turn indie blue
          }
        });
      }
      return { shapes: newShapes, message: "Mock refinement applied (Blue Color)." };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

    const shapesText = JSON.stringify(args.shapes);
    const selectedIdsText = args.selectedShapeIds.join(", ");

    const prompt = `
    You are an intelligent design assistant. You modify JSON data representing canvas shapes.
    
    CURRENT_SHAPES (JSON):
    ${shapesText}
    
    SELECTED_SHAPE_IDS:
    [${selectedIdsText}]
    
    USER_INSTRUCTION:
    "${args.prompt}"
    
    TASK:
    1. Analyze the USER_INSTRUCTION.
    2. Modify the properties (x, y, width, height, fill, stroke, content, borderRadius, etc.) of the relevant shapes to fulfill the request.
    3. If SELECTED_SHAPE_IDS is not empty, prioritize modifying those shapes, but you can modify others if necessary for context (e.g. alignment).
    4. If SELECTED_SHAPE_IDS is empty, treat the instruction as global (e.g. "make background dark").
    5. Return the COMPLETELY NEW JSON object of shapes. strictly valid JSON.
    
    RESPONSE FORMAT:
    {
        "shapes": { ...key value pairs of shapes... },
        "message": "Brief description of what changed"
    }
    `;

    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const json = JSON.parse(text);
      return json;
    } catch (e: any) {
      console.error("Gemini Refine Error:", e);
      throw new Error("Failed to refine shapes: " + e.message);
    }
  }
});

export const refineCode = action({
  args: {
    projectId: v.id("projects"),
    sourceCode: v.string(), // The current code
    prompt: v.string(),     // User instruction
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");

    const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

    // Fallback Mock
    if (!apiKey) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        code: args.sourceCode + "\n// Mock Refinement: " + args.prompt,
        message: "Refined (Mock)"
      };
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        You are an expert React/Tailwind Engineer.
        
        GOAL: Modify the existing React component based on the USER_INSTRUCTION.
        
        EXISTING_CODE:
        ${args.sourceCode}
        
        USER_INSTRUCTION:
        "${args.prompt}"
        
        RULES:
        1. Return ONLY the new full code. No markdown.
        2. Keep imports if needed, or add new ones (lucide-react).
        3. Maintain the default export.
        4. Be smart about what the user wants. If they say "dark mode", change colors.
        
        OUTPUT:
    `;

    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text();
      text = text.replace(/```tsx|```jsx|```/g, "").trim();

      return { code: text };
    } catch (e: any) {
      console.error("Gemini Refine Error:", e);
      throw new Error("Failed to refine code: " + e.message);
    }
  }
});
