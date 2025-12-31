import { query, mutation } from "./_generated/server";
import { auth } from "./auth";
import { v } from "convex/values";

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return null;
        }
        return await ctx.db.get(userId);
    },
});

export const updateUser = mutation({
    args: {
        name: v.optional(v.string()),
        image: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthenticated");

        await ctx.db.patch(userId, {
            ...args
        });
    }
});
