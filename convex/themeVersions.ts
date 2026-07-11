import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireProjectAccess } from "./lib/access";
import { getUserIdOrThrow } from "./lib/auth";

export const get = query({
  args: {
    themeId: v.id("themes"),
    version: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    const theme = await ctx.db.get(args.themeId);
    if (!theme) {
      return null;
    }

    await requireProjectAccess(ctx, theme.projectId, userId);

    return await ctx.db
      .query("themeVersions")
      .withIndex("by_theme_and_version", (q) => q.eq("themeId", args.themeId).eq("version", args.version))
      .first();
  },
});

export const list = query({
  args: { themeId: v.id("themes") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    const theme = await ctx.db.get(args.themeId);
    if (!theme) {
      return [];
    }

    await requireProjectAccess(ctx, theme.projectId, userId);

    return await ctx.db
      .query("themeVersions")
      .withIndex("by_theme_id", (q) => q.eq("themeId", args.themeId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    themeId: v.id("themes"),
    version: v.number(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    const theme = await ctx.db.get(args.themeId);
    if (!theme) {
      throw new Error("Theme not found");
    }

    await requireProjectAccess(ctx, theme.projectId, userId, "editor");

    const existing = await ctx.db
      .query("themeVersions")
      .withIndex("by_theme_and_version", (q) => q.eq("themeId", args.themeId).eq("version", args.version))
      .first();

    if (existing) {
      throw new Error(`Version ${args.version} already exists for this theme`);
    }

    return await ctx.db.insert("themeVersions", {
      themeId: args.themeId,
      version: args.version,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    themeId: v.id("themes"),
    version: v.number(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    const theme = await ctx.db.get(args.themeId);
    if (!theme) {
      throw new Error("Theme not found");
    }

    await requireProjectAccess(ctx, theme.projectId, userId, "editor");

    const themeVersion = await ctx.db
      .query("themeVersions")
      .withIndex("by_theme_and_version", (q) => q.eq("themeId", args.themeId).eq("version", args.version))
      .first();

    if (!themeVersion) {
      throw new Error(`Version ${args.version} not found for this theme`);
    }

    await ctx.db.patch(themeVersion._id, {
      content: args.content,
    });
  },
});
