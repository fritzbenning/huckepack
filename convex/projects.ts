import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireProjectAccess, requireTeamAccess } from "./lib/access";
import { getUserIdOrThrow } from "./lib/auth";

export const list = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireTeamAccess(ctx, args.teamId, userId);

    return await ctx.db
      .query("projects")
      .withIndex("by_team_id", (q) => q.eq("teamId", args.teamId))
      .collect();
  },
});

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.projectId, userId);
    return await ctx.db.get(args.projectId);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx);

    const teamMembers = await ctx.db
      .query("teamMembers")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const ownedTeams = await ctx.db
      .query("teams")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", userId))
      .collect();

    const teamIds = new Set<Id<"teams">>();
    ownedTeams.forEach((t) => {
      teamIds.add(t._id);
    });
    teamMembers.forEach((tm) => {
      teamIds.add(tm.teamId);
    });

    const projects = await Promise.all(
      Array.from(teamIds).flatMap(async (teamId) => {
        return await ctx.db
          .query("projects")
          .withIndex("by_team_id", (q) => q.eq("teamId", teamId))
          .collect();
      })
    );

    return projects.flat();
  },
});

export const create = mutation({
  args: {
    teamId: v.id("teams"),
    name: v.string(),
    description: v.optional(v.string()),
    sandpackTemplate: v.optional(v.string()),
    tsconfig: v.optional(v.any()),
    tailwindTheme: v.optional(v.id("themes")),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireTeamAccess(ctx, args.teamId, userId, "editor");

    const now = Date.now();

    const projectId = await ctx.db.insert("projects", {
      teamId: args.teamId,
      name: args.name,
      description: args.description,
      sandpackTemplate: args.sandpackTemplate,
      tsconfig: args.tsconfig,
      tailwindTheme: args.tailwindTheme,
      createdAt: now,
    });

    // Ensure default Tailwind theme exists for the project
    const defaultThemeId = await ctx.runMutation(internal.themes.ensureTailwindThemeExists, {
      projectId,
    });

    // Update project to reference the default theme if no theme was provided
    if (!args.tailwindTheme && defaultThemeId) {
      await ctx.db.patch(projectId, {
        tailwindTheme: defaultThemeId,
      });
    }

    await ctx.db.insert("projectMembers", {
      projectId,
      userId,
      role: "owner",
    });

    return projectId;
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    sandpackTemplate: v.optional(v.string()),
    tsconfig: v.optional(v.any()),
    tailwindTheme: v.optional(v.id("themes")),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.id, userId, "editor");

    const updates: {
      name?: string;
      description?: string;
      sandpackTemplate?: string;
      tsconfig?: Record<string, unknown>;
      tailwindTheme?: Id<"themes">;
    } = {};

    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.sandpackTemplate !== undefined) updates.sandpackTemplate = args.sandpackTemplate;
    if (args.tsconfig !== undefined) updates.tsconfig = args.tsconfig;
    if (args.tailwindTheme !== undefined) updates.tailwindTheme = args.tailwindTheme;

    await ctx.db.patch(args.id, updates);
  },
});

export const delete_ = mutation({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireProjectAccess(ctx, args.id, userId, "admin");

    await ctx.runMutation(internal.files.cleanupProjectFiles, {
      projectId: args.id,
    });

    await ctx.runMutation(internal.themes.cleanupProjectThemes, {
      projectId: args.id,
    });

    // Clean up pinned items for this project
    const pinnedItems = await ctx.db
      .query("pinnedItems")
      .withIndex("by_entity", (q) => q.eq("entityType", "project").eq("entityId", args.id))
      .collect();

    for (const pinnedItem of pinnedItems) {
      await ctx.db.delete(pinnedItem._id);
    }

    // Clean up presence records for this project
    const presenceRecords = await ctx.db
      .query("presence")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.id))
      .collect();

    for (const presence of presenceRecords) {
      await ctx.db.delete(presence._id);
    }

    // Clean up project members
    const projectMembers = await ctx.db
      .query("projectMembers")
      .withIndex("by_project_id", (q) => q.eq("projectId", args.id))
      .collect();
    for (const member of projectMembers) {
      await ctx.db.delete(member._id);
    }

    // Finally, delete the project
    await ctx.db.delete(args.id);
  },
});
