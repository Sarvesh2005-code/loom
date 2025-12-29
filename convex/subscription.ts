import { query } from "./_generated/server";
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
            // .filter((q) => q.eq(q.field("userId"), userId)) // Fallback if index fails
            .first();

        // Check if subscription exists and is active
        // For now, we'll return true if any subscription exists or default to false
        // Transcript mentions "Redirects users without active subscriptions"
        // We'll implement basic logic
        return !!subscription && subscription.status === "active";
    },
});
