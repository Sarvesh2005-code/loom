import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getProject = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return null;
        }
        const project = await ctx.db.get(args.projectId);
        // Verify ownership
        if (!project || project.userId !== userId) {
            return null;
        }
        return project;
    },
});

export const createProject = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthenticated");

        const projectId = await ctx.db.insert("projects", {
            userId,
            name: args.name,
            description: args.description,
            status: "active"
        });

        // Initialize counters or other related data if needed
        return projectId;
    }
});

export const listProjects = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        return await ctx.db
            .query("projects")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();
    }
});

export const updateProject = mutation({
    args: {
        projectId: v.id("projects"),
        styleGuide: v.optional(v.any()),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        moodBoardImages: v.optional(v.array(v.string())), // Include this if not present
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthenticated");

        const project = await ctx.db.get(args.projectId);
        if (!project || project.userId !== userId) throw new Error("Unauthorized");

        const { projectId, ...patches } = args;
        await ctx.db.patch(projectId, patches);
    }
});
