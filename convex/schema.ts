import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
    ...authTables,
    // Schema definition for S2C
    users: defineTable({
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
    }).index("email", ["email"]),
    projects: defineTable({
        userId: v.id("users"),
        name: v.string(),
        description: v.optional(v.string()),
        styleGuide: v.optional(v.any()), // Placeholder for style guide object
        sketchesData: v.optional(v.any()), // Placeholder for sketches
        viewportData: v.optional(v.any()), // Placeholder for viewport
        moodBoardImages: v.optional(v.array(v.string())), // Array of image URLs or storage IDs
        inspirationImages: v.optional(v.array(v.string())),
        tags: v.optional(v.array(v.string())),
        projectNumber: v.optional(v.number()),
        status: v.optional(v.string()), // e.g., "active", "archived"
    }).index("by_user", ["userId"]),
    project_counters: defineTable({
        projectId: v.id("projects"),
        count: v.number(),
    }).index("by_project", ["projectId"]),
    subscriptions: defineTable({
        userId: v.id("users"),
        amount: v.number(),
        type: v.string(),
        reason: v.optional(v.string()),
        priceId: v.optional(v.string()),
        planCode: v.optional(v.string()),
        status: v.string(),
        startDate: v.number(),
        endDate: v.optional(v.number()),
    }).index("by_user", ["userId"]),
    credits_ledger: defineTable({
        userId: v.id("users"),
        amount: v.number(),
        type: v.string(), // "credit", "debit"
        description: v.optional(v.string()),
        timestamp: v.number(),
    }).index("by_user", ["userId"]),
});
