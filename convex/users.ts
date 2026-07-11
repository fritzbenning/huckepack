import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./lib/auth";

export const current = query({
  args: {},
  handler: async (ctx) => {
    try {
      return await getCurrentUser(ctx);
    } catch {
      return null;
    }
  },
});

export const get = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const getByGithubId = query({
  args: { githubId: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_github_id", (q) => q.eq("githubId", args.githubId))
      .first();
  },
});

export const getByGoogleId = query({
  args: { googleId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_google_id", (q) => q.eq("googleId", args.googleId))
      .first();
  },
});

export const exists = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    return user !== null;
  },
});

export const getByIds = query({
  args: { userIds: v.array(v.id("users")) },
  handler: async (ctx, args) => {
    if (args.userIds.length === 0) {
      return [];
    }
    const users = await Promise.all(args.userIds.map((id) => ctx.db.get(id)));
    return users.filter((u) => u !== null);
  },
});

export const updateGitHubAppId = mutation({
  args: {
    userId: v.id("users"),
    githubAppId: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      githubAppId: args.githubAppId,
      updatedAt: Date.now(),
    });
    return args.userId;
  },
});
