import { query } from "./_generated/server";
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
