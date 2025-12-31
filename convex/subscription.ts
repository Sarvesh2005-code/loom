import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const hasEntitlement = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) {
            return false;
        }
        const subscription = await ctx.db
            .query("subscriptions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        // Check if subscription exists and is active
        return !!subscription && subscription.status === "active";
    },
});

export const createSubscription = mutation({
    args: {
        planCode: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthenticated");

        // Cancel existing active subscriptions
        const existing = await ctx.db
            .query("subscriptions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        for (const sub of existing) {
            if (sub.status === "active") {
                await ctx.db.patch(sub._id, { status: "canceled", endDate: Date.now() });
            }
        }

        // Create new subscription
        await ctx.db.insert("subscriptions", {
            userId,
            amount: 0, // Free for demo
            type: "subscription",
            status: "active",
            planCode: args.planCode,
            startDate: Date.now(),
        });
    }
});
