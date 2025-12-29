import { action } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// This would typically call Anthropics API or OpenAI
export const generateUI = action({
    args: {
        prompt: v.string(),
        projectId: v.optional(v.id("projects"))
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthenticated");

        // Mock Response Structure for "Stitch-like" generation
        // In a real app, you'd call:
        // const response = await fetch("https://api.anthropic.com/v1/messages", ...);

        // Simulating a delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Return a structured JSON representing a UI component
        // This allows us to render it dynamically on the frontend
        return {
            type: "component",
            name: "GeneratedCard",
            elements: [
                {
                    type: "div",
                    className: "p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4",
                    children: [
                        {
                            type: "div",
                            className: "shrink-0",
                            children: [
                                {
                                    type: "img",
                                    className: "h-12 w-12",
                                    src: "/globe.svg",
                                    alt: "Logo"
                                }
                            ]
                        },
                        {
                            type: "div",
                            children: [
                                {
                                    type: "div",
                                    className: "text-xl font-medium text-black",
                                    content: "ChitChat"
                                },
                                {
                                    type: "p",
                                    className: "text-slate-500",
                                    content: "You have a new message!"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    },
});
