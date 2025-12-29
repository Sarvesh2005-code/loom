import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const generateUploadUrl = mutation(async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Unauthenticated");
    return await ctx.storage.generateUploadUrl();
});

export const getMoodBoardImages = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        // Basic auth check
        const userId = await auth.getUserId(ctx);
        if (!userId) return []; // or error

        const project = await ctx.db.get(args.projectId);
        if (!project || project.userId !== userId) return [];

        if (!project.moodBoardImages) return [];

        // Fetch URLs for storage IDs
        const images = await Promise.all(
            project.moodBoardImages.map(async (storageId) => ({
                storageId,
                url: await ctx.storage.getUrl(storageId),
            }))
        );
        return images;
    },
});

export const addMoodBoardImage = mutation({
    args: {
        projectId: v.id("projects"),
        storageId: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthenticated");

        const project = await ctx.db.get(args.projectId);
        if (!project || project.userId !== userId) throw new Error("Unauthorized");

        const currentImages = project.moodBoardImages || [];
        await ctx.db.patch(args.projectId, {
            moodBoardImages: [...currentImages, args.storageId],
        });
    },
});

export const removeMoodBoardImage = mutation({
    args: {
        projectId: v.id("projects"),
        storageId: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthenticated");

        const project = await ctx.db.get(args.projectId);
        if (!project || project.userId !== userId) throw new Error("Unauthorized");

        const currentImages = project.moodBoardImages || [];
        await ctx.db.patch(args.projectId, {
            moodBoardImages: currentImages.filter((id) => id !== args.storageId),
        });

        // Optionally delete from storage too
        // await ctx.storage.delete(args.storageId); 
    },
});
