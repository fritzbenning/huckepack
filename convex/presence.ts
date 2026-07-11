import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserIdOrThrow } from "./lib/auth";
import { requireProjectAccess } from "./lib/access";

export const join = mutation({
  args: {
    projectId: v.id("projects"),
    sessionId: v.string(),
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId);

    const now = Date.now();

    const existing = await ctx.db
      .query("presence")
      .withIndex("by_project_and_session", (q) =>
        q.eq("projectId", args.projectId).eq("sessionId", args.sessionId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        userId,
        username: args.username,
        lastSeen: now,
      });
    } else {
      await ctx.db.insert("presence", {
        projectId: args.projectId,
        userId,
        sessionId: args.sessionId,
        username: args.username,
        lastSeen: now,
      });
    }
  },
});

export const updateLastSeen = mutation({
  args: {
    projectId: v.id("projects"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId);

    const presence = await ctx.db
      .query("presence")
      .withIndex("by_project_and_session", (q) =>
        q.eq("projectId", args.projectId).eq("sessionId", args.sessionId)
      )
      .first();

    if (presence) {
      await ctx.db.patch(presence._id, {
        lastSeen: Date.now(),
      });
    }
  },
});

export const leave = mutation({
  args: {
    projectId: v.id("projects"),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId);

    const presence = await ctx.db
      .query("presence")
      .withIndex("by_project_and_session", (q) =>
        q.eq("projectId", args.projectId).eq("sessionId", args.sessionId)
      )
      .first();

    if (presence) {
      await ctx.db.delete(presence._id);
    }
  },
});

export const list = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId);

    const now = Date.now();
    const timeout = 30000;

    const presences = await ctx.db
      .query("presence")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .collect();

    const activePresences = presences.filter((p) => now - p.lastSeen < timeout);

    return activePresences.map((p) => ({
      userId: p.userId,
      username: p.username,
      sessionId: p.sessionId,
      lastSeen: p.lastSeen,
    }));
  },
});

