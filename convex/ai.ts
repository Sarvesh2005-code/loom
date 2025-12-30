import { action } from "./_generated/server";
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
        Content based on ${Object.keys(args.shapes).length} shapes.
      </div>
    </div>
  );
}`
            };
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an expert UI Engineer using React, TailwindCSS, and Lucide React.
        
        GOAL: Convert the following wireframe shapes into a production-ready React component.
        
        SHAPES_DATA:
        ${shapesText}
        
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
        `;

        try {
            const result = await model.generateContent(prompt);
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
