import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: { githubAppId: v.number() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("githubInstallations")
      .withIndex("by_github_app_id", (q) => q.eq("githubAppId", args.githubAppId))
      .first();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("githubInstallations").collect();
  },
});

export const upsert = mutation({
  args: {
    githubAppId: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("githubInstallations")
      .withIndex("by_github_app_id", (q) => q.eq("githubAppId", args.githubAppId))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("githubInstallations", {
      githubAppId: args.githubAppId,
      createdAt: Date.now(),
    });
  },
});

export const delete_ = mutation({
  args: {
    githubAppId: v.number(),
  },
  handler: async (ctx, args) => {
    const installation = await ctx.db
      .query("githubInstallations")
      .withIndex("by_github_app_id", (q) => q.eq("githubAppId", args.githubAppId))
      .first();

    if (installation) {
      await ctx.db.delete(installation._id);
    }
  },
});
