import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { getUserIdOrThrow } from "./lib/auth";
import { entityTypeValidator } from "./lib/validators";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx);

    return await ctx.db
      .query("pinnedItems")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const isPinned = query({
  args: {
    entityType: entityTypeValidator,
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    const pinnedItem = await ctx.db
      .query("pinnedItems")
      .withIndex("by_user_and_entity", (q) =>
        q.eq("userId", userId).eq("entityType", args.entityType).eq("entityId", args.entityId)
      )
      .first();

    return pinnedItem !== null;
  },
});

export const listWithEntities = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx);

    const pinnedItems = await ctx.db
      .query("pinnedItems")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();

    const entities = await Promise.all(
      pinnedItems.map(async (item) => {
        let entity = null;

        try {
          switch (item.entityType) {
            case "project":
              entity = await ctx.db.get(item.entityId as Id<"projects">);
              break;
            case "file":
              entity = await ctx.db.get(item.entityId as Id<"files">);
              break;
            case "workspace":
              entity = await ctx.db.get(item.entityId as Id<"workspaces">);
              break;
            case "team":
              entity = await ctx.db.get(item.entityId as Id<"teams">);
              break;
          }
        } catch {
          entity = null;
        }

        return {
          pinnedItem: item,
          entity,
        };
      })
    );

    return entities.filter((e) => e.entity !== null);
  },
});

export const pin = mutation({
  args: {
    entityType: entityTypeValidator,
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    const existing = await ctx.db
      .query("pinnedItems")
      .withIndex("by_user_and_entity", (q) =>
        q.eq("userId", userId).eq("entityType", args.entityType).eq("entityId", args.entityId)
      )
      .first();

    if (existing) {
      const now = Date.now();
      await ctx.db.patch(existing._id, {
        updatedAt: now,
      });
      return existing._id;
    }

    const now = Date.now();
    return await ctx.db.insert("pinnedItems", {
      userId,
      entityType: args.entityType,
      entityId: args.entityId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const unpin = mutation({
  args: {
    entityType: entityTypeValidator,
    entityId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    const pinnedItem = await ctx.db
      .query("pinnedItems")
      .withIndex("by_user_and_entity", (q) =>
        q.eq("userId", userId).eq("entityType", args.entityType).eq("entityId", args.entityId)
      )
      .first();

    if (pinnedItem) {
      await ctx.db.delete(pinnedItem._id);
    }
  },
});
