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
        // Strict Shape Schema
        canvasData: v.optional(v.object({
            // shapes: v.any(), // Removed in favor of strict schema below
            // Actually, we can use a JSON string or simplified array. 
            // Better: v.array of objects if we assume standard shape structure, but objects index by ID is faster for canvas.
            // Compromise: Storing as JSON string is safest for complex nested Redux state, OR strict array.
            // Let's us strict array for queryability.
            shapes: v.array(v.object({
                id: v.string(),
                type: v.string(),
                x: v.number(),
                y: v.number(),
                width: v.number(),
                height: v.number(),
                fill: v.string(),
                stroke: v.string(),
                strokeWidth: v.number(),
                rotation: v.number(),
                content: v.optional(v.string()),
            })),
            viewport: v.object({
                x: v.number(),
                y: v.number(),
                zoom: v.number()
            })
        })),
        styleGuide: v.optional(v.object({
            primaryColor: v.optional(v.string()),
            fontFamily: v.optional(v.string()),
            borderRadius: v.optional(v.string()),
        })),
        moodBoardImages: v.optional(v.array(v.string())),
        tags: v.optional(v.array(v.string())),
        isArchived: v.optional(v.boolean()),
        status: v.optional(v.string()), // Deprecated, but kept for existing data validation
    }).index("by_user", ["userId"]),
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
    project_counters: defineTable({
        userId: v.id("users"),
        amount: v.number(),
        type: v.string(), // "credit", "debit"
        description: v.optional(v.string()),
        timestamp: v.number(),
    }).index("by_user", ["userId"]),
});
