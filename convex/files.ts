import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { requireFileAccess, requireProjectAccess } from "./lib/access";
import { getUserIdOrThrow } from "./lib/auth";

export const get = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId);
    return await ctx.db.get(args.fileId);
  },
});

export const getWithVersion = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId);

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      return null;
    }

    return {
      ...file,
      currentCode: file.code,
    };
  },
});

export const listMetadata = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId);

    const files = await ctx.db
      .query("files")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Return files WITHOUT code - only metadata needed for most UI operations
    return files.map(({ code, ...file }) => file);
  },
});

export const listMetadataInternal = internalQuery({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const files = await ctx.db
      .query("files")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Return files WITHOUT code - only metadata needed for most UI operations
    return files.map(({ code, ...file }) => file);
  },
});

export const getFileInternal = internalQuery({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.fileId);
  },
});

export const getFileMetadataInternal = internalQuery({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      return null;
    }
    const { code, ...metadata } = file;
    return metadata;
  },
});

export const listWithVersions = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId);

    const files = await ctx.db
      .query("files")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .collect();

    return files.map((file) => ({
      ...file,
      currentCode: file.code,
    }));
  },
});

export const getCurrentVersion = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId);

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      return null;
    }

    return {
      version: file.currentVersion,
      code: file.code,
    };
  },
});

export const search = query({
  args: {
    projectId: v.id("projects"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId);

    return await ctx.db
      .query("files")
      .withSearchIndex("search_by_name", (q) => q.search("name", args.query).eq("projectId", args.projectId))
      .collect();
  },
});

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.string(),
    type: v.string(),
    extension: v.string(),
    code: v.string(),
    draft: v.optional(v.boolean()),
    ownerId: v.optional(v.id("users")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId, "editor");

    const now = Date.now();

    const fileId = await ctx.db.insert("files", {
      projectId: args.projectId,
      name: args.name,
      type: args.type,
      extension: args.extension,
      currentVersion: 1,
      code: args.code,
      updatedAt: now,
      lastEditor: userId,
      draft: args.draft ?? false,
      ownerId: args.ownerId ?? userId,
      tags: args.tags,
      viewportWidth: 390,
      viewportBehavior: "fixed",
      history: [],
      historyPointer: 0,
      diffCount: 0,
    });

    await ctx.db.insert("fileVersions", {
      fileId,
      version: 1,
      code: args.code,
      extension: args.extension,
      createdAt: now,
      updatedAt: now,
      userId,
    });

    return fileId;
  },
});

export const upsert = mutation({
  args: {
    id: v.optional(v.id("files")),
    data: v.object({
      projectId: v.id("projects"),
      name: v.string(),
      type: v.string(),
      extension: v.string(),
      code: v.string(),
      draft: v.optional(v.boolean()),
      ownerId: v.optional(v.id("users")),
      tags: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.data.projectId, userId, "editor");

    const now = Date.now();

    if (args.id) {
      await requireFileAccess(ctx, args.id, userId, "editor");

      const existing = await ctx.db.get(args.id);
      if (!existing) {
        throw new Error("File not found");
      }

      const newVersion = existing.currentVersion + 1;

      await ctx.db.patch(args.id, {
        name: args.data.name,
        type: args.data.type,
        extension: args.data.extension,
        currentVersion: newVersion,
        code: args.data.code,
        updatedAt: now,
        lastEditor: userId,
        draft: args.data.draft ?? false,
        ownerId: args.data.ownerId ?? userId,
        tags: args.data.tags,
        viewportWidth: existing.viewportWidth ?? 390,
        viewportBehavior: existing.viewportBehavior ?? "fixed",
      });

      await ctx.db.insert("fileVersions", {
        fileId: args.id,
        version: newVersion,
        code: args.data.code,
        extension: args.data.extension,
        createdAt: now,
        updatedAt: now,
        userId,
      });

      return args.id;
    }

    const fileId = await ctx.db.insert("files", {
      projectId: args.data.projectId,
      name: args.data.name,
      type: args.data.type,
      extension: args.data.extension,
      currentVersion: 1,
      code: args.data.code,
      updatedAt: now,
      lastEditor: userId,
      draft: args.data.draft ?? false,
      ownerId: args.data.ownerId ?? userId,
      tags: args.data.tags,
      viewportWidth: 390,
      viewportBehavior: "fixed",
      history: [],
      historyPointer: 0,
      diffCount: 0,
    });

    await ctx.db.insert("fileVersions", {
      fileId,
      version: 1,
      code: args.data.code,
      extension: args.data.extension,
      createdAt: now,
      updatedAt: now,
      userId,
    });

    return fileId;
  },
});

export const update = mutation({
  args: {
    id: v.id("files"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    extension: v.optional(v.string()),
    code: v.optional(v.string()),
    draft: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    viewportWidth: v.optional(v.number()),
    viewportBehavior: v.optional(v.union(v.literal("auto"), v.literal("fixed"))),
    updatedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.id, userId, "editor");

    const file = await ctx.db.get(args.id);
    if (!file) {
      throw new Error("File not found");
    }

    const now = Date.now();
    const updates: {
      name?: string;
      type?: string;
      extension?: string;
      currentVersion?: number;
      code?: string;
      updatedAt?: number;
      lastEditor?: Id<"users">;
      draft?: boolean;
      tags?: string[];
      viewportWidth?: number;
      viewportBehavior?: "auto" | "fixed";
    } = {};

    if (args.name !== undefined) updates.name = args.name;
    if (args.type !== undefined) updates.type = args.type;
    if (args.extension !== undefined) updates.extension = args.extension;
    if (args.code !== undefined) updates.code = args.code;
    if (args.draft !== undefined) updates.draft = args.draft;
    if (args.tags !== undefined) updates.tags = args.tags;
    if (args.viewportWidth !== undefined) updates.viewportWidth = args.viewportWidth;
    if (args.viewportBehavior !== undefined) updates.viewportBehavior = args.viewportBehavior;

    const hasCodeChanges = args.code !== undefined;

    if (hasCodeChanges) {
      const newVersion = file.currentVersion + 1;
      updates.currentVersion = newVersion;
      updates.updatedAt = args.updatedAt ?? now;
      updates.lastEditor = userId;
    }

    await ctx.db.patch(args.id, updates);
  },
});

export const updateFileContentInternal = internalMutation({
  args: {
    fileId: v.id("files"),
    content: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    const now = Date.now();
    const newVersion = file.currentVersion + 1;

    await ctx.db.patch(args.fileId, {
      code: args.content,
      currentVersion: newVersion,
      updatedAt: now,
      lastEditor: args.userId,
    });

    await ctx.db.insert("fileVersions", {
      fileId: args.fileId,
      version: newVersion,
      code: args.content,
      extension: file.extension,
      createdAt: now,
      updatedAt: now,
      userId: args.userId,
    });

    return args.content;
  },
});

export const delete_ = mutation({
  args: {
    id: v.id("files"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.id, userId, "admin");

    // Delete all file versions first
    const fileVersions = await ctx.db
      .query("fileVersions")
      .withIndex("by_file_id", (q) => q.eq("fileId", args.id))
      .collect();

    for (const version of fileVersions) {
      await ctx.db.delete(version._id);
    }

    // Delete the file
    await ctx.db.delete(args.id);
  },
});

export const cleanupProjectFiles = internalMutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    // Get all files for this project
    const files = await ctx.db
      .query("files")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.projectId))
      .collect();

    // Delete all file versions and files
    for (const file of files) {
      // Delete all versions for this file
      const fileVersions = await ctx.db
        .query("fileVersions")
        .withIndex("by_file_id", (q) => q.eq("fileId", file._id))
        .collect();

      for (const version of fileVersions) {
        await ctx.db.delete(version._id);
      }

      // Delete the file
      await ctx.db.delete(file._id);
    }
  },
});

export const batchUpdate = mutation({
  args: {
    updates: v.array(
      v.object({
        id: v.id("files"),
        name: v.optional(v.string()),
        type: v.optional(v.string()),
        extension: v.optional(v.string()),
        code: v.optional(v.string()),
        draft: v.optional(v.boolean()),
        tags: v.optional(v.array(v.string())),
        viewportWidth: v.optional(v.number()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);

    await Promise.all(
      args.updates.map(async (update) => {
        await requireFileAccess(ctx, update.id, userId, "editor");

        const file = await ctx.db.get(update.id);
        if (!file) {
          throw new Error(`File ${update.id} not found`);
        }

        const now = Date.now();
        const updates: {
          name?: string;
          type?: string;
          extension?: string;
          currentVersion?: number;
          code?: string;
          updatedAt?: number;
          lastEditor?: Id<"users">;
          draft?: boolean;
          tags?: string[];
          viewportWidth?: number;
        } = {};

        if (update.name !== undefined) updates.name = update.name;
        if (update.type !== undefined) updates.type = update.type;
        if (update.extension !== undefined) updates.extension = update.extension;
        if (update.code !== undefined) updates.code = update.code;
        if (update.draft !== undefined) updates.draft = update.draft;
        if (update.tags !== undefined) updates.tags = update.tags;
        if (update.viewportWidth !== undefined) updates.viewportWidth = update.viewportWidth;

        const hasCodeChanges = update.code !== undefined;

        if (hasCodeChanges) {
          updates.updatedAt = now;
          updates.lastEditor = userId;
        }

        await ctx.db.patch(update.id, updates);
      })
    );
  },
});

export const getHistory = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId);

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      return null;
    }

    const versions = await ctx.db
      .query("fileVersions")
      .withIndex("by_file_id", (q) => q.eq("fileId", args.fileId))
      .order("desc")
      .collect();

    return {
      history: file.history ?? [],
      historyPointer: file.historyPointer ?? 0,
      currentCode: file.code,
      diffCount: file.diffCount ?? 0,
      versions,
    };
  },
});

export const getVersions = query({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId);

    const versions = await ctx.db
      .query("fileVersions")
      .withIndex("by_file_id", (q) => q.eq("fileId", args.fileId))
      .order("desc")
      .collect();

    return versions;
  },
});

export const incrementDiffCount = internalMutation({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    const currentDiffCount = file.diffCount ?? 0;
    await ctx.db.patch(args.fileId, {
      diffCount: currentDiffCount + 1,
    });
  },
});

export const addHistoryEntry = mutation({
  args: {
    fileId: v.id("files"),
    diff: v.string(),
    historyPointer: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId, "editor");

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    const history = file.history ?? [];
    const historyPointer = args.historyPointer ?? file.historyPointer ?? 0;
    const newHistory = [...history.slice(0, historyPointer + 1), { diff: args.diff, timestamp: Date.now(), userId }];

    const trimmedHistory = newHistory.length > 100 ? newHistory.slice(-100) : newHistory;
    const newPointer = trimmedHistory.length - 1;
    const currentDiffCount = file.diffCount ?? 0;

    await ctx.db.patch(args.fileId, {
      history: trimmedHistory,
      historyPointer: newPointer,
      diffCount: currentDiffCount + 1,
    });
  },
});

export const updateHistoryPointer = mutation({
  args: {
    fileId: v.id("files"),
    historyPointer: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId, "editor");

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    const history = file.history ?? [];
    const validPointer = Math.max(0, Math.min(args.historyPointer, history.length - 1));

    await ctx.db.patch(args.fileId, {
      historyPointer: validPointer,
    });
  },
});

export const updateDiffCount = mutation({
  args: {
    fileId: v.id("files"),
    diffCount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId, "editor");

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    await ctx.db.patch(args.fileId, {
      diffCount: args.diffCount,
    });
  },
});

export const createVersionSnapshot = mutation({
  args: {
    fileId: v.id("files"),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId, "editor");

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    const now = Date.now();
    const newVersion = file.currentVersion + 1;

    await ctx.db.insert("fileVersions", {
      fileId: args.fileId,
      version: newVersion,
      code: args.code,
      extension: file.extension,
      createdAt: now,
      updatedAt: now,
      userId,
    });

    const history = file.history ?? [];
    const lastDiff = history[history.length - 1];

    await ctx.db.patch(args.fileId, {
      currentVersion: newVersion,
      history: lastDiff ? [lastDiff] : [],
      historyPointer: lastDiff ? 0 : 0,
      diffCount: 0,
    });
  },
});
