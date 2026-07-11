import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { requireFileAccess } from "./lib/access";
import { getUserIdOrThrow } from "./lib/auth";

export const get = query({
  args: {
    fileId: v.id("files"),
    version: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId);

    return await ctx.db
      .query("fileVersions")
      .withIndex("by_file_and_version", (q) => q.eq("fileId", args.fileId).eq("version", args.version))
      .first();
  },
});

export const list = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId);

    return await ctx.db
      .query("fileVersions")
      .withIndex("by_file_id", (q) => q.eq("fileId", args.fileId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    fileId: v.id("files"),
    version: v.number(),
    code: v.string(),
    extension: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId, "editor");

    const existing = await ctx.db
      .query("fileVersions")
      .withIndex("by_file_and_version", (q) => q.eq("fileId", args.fileId).eq("version", args.version))
      .first();

    if (existing) {
      throw new Error(`Version ${args.version} already exists for this file`);
    }

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    const now = Date.now();
    return await ctx.db.insert("fileVersions", {
      fileId: args.fileId,
      version: args.version,
      code: args.code,
      extension: args.extension ?? file.extension,
      createdAt: now,
      updatedAt: now,
      userId,
    });
  },
});

export const createFromCurrent = mutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId, "editor");

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    const newVersion = file.currentVersion + 1;

    const existing = await ctx.db
      .query("fileVersions")
      .withIndex("by_file_and_version", (q) => q.eq("fileId", args.fileId).eq("version", newVersion))
      .first();

    if (existing) {
      throw new Error(`Version ${newVersion} already exists for this file`);
    }

    const now = Date.now();
    await ctx.db.insert("fileVersions", {
      fileId: args.fileId,
      version: newVersion,
      code: file.code,
      extension: file.extension,
      createdAt: now,
      updatedAt: now,
      userId,
    });

    await ctx.db.patch(args.fileId, {
      currentVersion: newVersion,
    });

    return newVersion;
  },
});

export const update = mutation({
  args: {
    fileId: v.id("files"),
    version: v.number(),
    code: v.optional(v.string()),
    extension: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId, "editor");

    const fileVersion = await ctx.db
      .query("fileVersions")
      .withIndex("by_file_and_version", (q) => q.eq("fileId", args.fileId).eq("version", args.version))
      .first();

    if (!fileVersion) {
      throw new Error(`Version ${args.version} not found for this file`);
    }

    const updates: {
      code?: string;
      extension?: string;
      updatedAt: number;
    } = {
      updatedAt: Date.now(),
    };

    if (args.code !== undefined) updates.code = args.code;
    if (args.extension !== undefined) updates.extension = args.extension;

    await ctx.db.patch(fileVersion._id, updates);
  },
});

export const backfillUpdatedAt = internalMutation({
  handler: async (ctx) => {
    const allVersions = await ctx.db.query("fileVersions").collect();
    let updated = 0;

    for (const version of allVersions) {
      if (version.updatedAt === undefined) {
        await ctx.db.patch(version._id, {
          updatedAt: version.createdAt,
        });
        updated++;
      }
    }

    return { updated, total: allVersions.length };
  },
});

export const backfillUserId = internalMutation({
  handler: async (ctx) => {
    const allVersions = await ctx.db.query("fileVersions").collect();
    let updated = 0;

    for (const version of allVersions) {
      if (version.userId === undefined) {
        const file = await ctx.db.get(version.fileId);
        if (file) {
          const userId = file.ownerId ?? file.lastEditor ?? null;
          if (userId) {
            await ctx.db.patch(version._id, {
              userId,
            });
            updated++;
          }
        }
      }
    }

    return { updated, total: allVersions.length };
  },
});
