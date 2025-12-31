import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const saveImage = mutation({
    args: {
        projectId: v.id("projects"),
        storageId: v.id("_storage"),
        url: v.string(), // We might store the public URL or just storageId
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthenticated");

        const project = await ctx.db.get(args.projectId);
        if (!project || project.userId !== userId) throw new Error("Unauthorized");

        // Add to project's moodBoardImages array
        // We need to decide if we store URLs or IDs. 
        // Schema says: moodBoardImages: v.array(v.string())

        // Let's store the URL for easier access on frontend, or storage ID.
        // If we store URL, we need to generate it from storageId.
        // Actually, let's assume specific implementation: store storageId string for now or the URL provided.
        // The simple way is: store the URL the client gives us or the storage ID.

        // Better: client uploads, gets storageId, we verify and store it.
        // But for MVP, let's just append the string provided.

        const currentImages = project.moodBoardImages || [];
        await ctx.db.patch(args.projectId, {
            moodBoardImages: [...currentImages, args.url]
        });
    }
});

export const getImageUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});
