import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";
import { requireTeamAccess, requireWorkspaceAccess } from "./lib/access";
import { getUserIdOrThrow } from "./lib/auth";
import { teamRoleValidator } from "./lib/validators";

export const list = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireWorkspaceAccess(ctx, args.workspaceId, userId);

    return await ctx.db
      .query("teams")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const get = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireTeamAccess(ctx, args.teamId, userId);
    return await ctx.db.get(args.teamId);
  },
});

export const getByOwner = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const currentUserId = await getUserIdOrThrow(ctx);
    if (args.userId !== currentUserId) {
      throw new Error("Cannot access teams owned by another user");
    }
    return await ctx.db
      .query("teams")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", args.userId))
      .collect();
  },
});

export const getUsers = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireTeamAccess(ctx, args.teamId, userId);

    const team = await ctx.db.get(args.teamId);
    if (!team) {
      return [];
    }

    const teamMembers = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_id", (q) => q.eq("teamId", args.teamId))
      .collect();

    const userIds = new Set<Id<"users">>();
    teamMembers.forEach((tm) => {
      userIds.add(tm.userId);
    });
    if (team.ownerId) {
      userIds.add(team.ownerId);
    }

    const users = await Promise.all(Array.from(userIds).map((id) => ctx.db.get(id)));

    return users
      .filter((u) => u !== null)
      .map((u) => {
        const isOwner = u!._id === team.ownerId;
        const teamMember = teamMembers.find((tm) => tm.userId === u!._id);
        return {
          user: u!,
          role: isOwner ? ("owner" as const) : (teamMember?.role ?? "member"),
        };
      });
  },
});

export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const ownerId = await getUserIdOrThrow(ctx);
    await requireWorkspaceAccess(ctx, args.workspaceId, ownerId, "member");

    const now = Date.now();

    const teamId = await ctx.db.insert("teams", {
      workspaceId: args.workspaceId,
      ownerId,
      name: args.name,
      createdAt: now,
    });

    await ctx.db.insert("teamMembers", {
      teamId,
      userId: ownerId,
      role: "owner",
    });

    return teamId;
  },
});

export const update = mutation({
  args: {
    id: v.id("teams"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireTeamAccess(ctx, args.id, userId, "admin");

    const updates: { name?: string } = {};
    if (args.name !== undefined) {
      updates.name = args.name;
    }

    await ctx.db.patch(args.id, updates);
  },
});

export const delete_ = mutation({
  args: {
    id: v.id("teams"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireTeamAccess(ctx, args.id, userId, "owner");

    // Get all projects in this team
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_team_id", (q) => q.eq("teamId", args.id))
      .collect();

    // Delete all projects and their associated files/themes using cleanup functions
    for (const project of projects) {
      // Unpin project if pinned
      const pinnedProject = await ctx.db
        .query("pinnedItems")
        .withIndex("by_user_and_entity", (q) =>
          q.eq("userId", userId).eq("entityType", "project").eq("entityId", project._id)
        )
        .first();
      if (pinnedProject) {
        await ctx.db.delete(pinnedProject._id);
      }

      // Use cleanup functions to delete files and themes (includes versions)
      await ctx.runMutation(internal.files.cleanupProjectFiles, {
        projectId: project._id,
      });

      await ctx.runMutation(internal.themes.cleanupProjectThemes, {
        projectId: project._id,
      });

      // Clean up pinned items for files in this project
      const files = await ctx.db
        .query("files")
        .withIndex("by_project_id", (q) => q.eq("projectId", project._id))
        .collect();
      for (const file of files) {
        const pinnedFile = await ctx.db
          .query("pinnedItems")
          .withIndex("by_user_and_entity", (q) =>
            q.eq("userId", userId).eq("entityType", "file").eq("entityId", file._id)
          )
          .first();
        if (pinnedFile) {
          await ctx.db.delete(pinnedFile._id);
        }
      }

      // Clean up presence records for this project
      const presenceRecords = await ctx.db
        .query("presence")
        .withIndex("by_project_id", (q) => q.eq("projectId", project._id))
        .collect();
      for (const presence of presenceRecords) {
        await ctx.db.delete(presence._id);
      }

      // Delete project
      await ctx.db.delete(project._id);
    }

    // Clean up team members
    const teamMembers = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_id", (q) => q.eq("teamId", args.id))
      .collect();
    for (const member of teamMembers) {
      await ctx.db.delete(member._id);
    }

    // Unpin team if pinned
    const pinnedTeam = await ctx.db
      .query("pinnedItems")
      .withIndex("by_user_and_entity", (q) => q.eq("userId", userId).eq("entityType", "team").eq("entityId", args.id))
      .first();
    if (pinnedTeam) {
      await ctx.db.delete(pinnedTeam._id);
    }

    // Delete the team
    await ctx.db.delete(args.id);
  },
});

export const addUser = mutation({
  args: {
    teamId: v.id("teams"),
    userId: v.id("users"),
    role: teamRoleValidator,
  },
  handler: async (ctx, args) => {
    const currentUserId = await getUserIdOrThrow(ctx);
    await requireTeamAccess(ctx, args.teamId, currentUserId, "admin");

    const team = await ctx.db.get(args.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    await requireWorkspaceAccess(ctx, team.workspaceId, args.userId, "member");

    const existing = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) => q.eq("teamId", args.teamId).eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role });
      return existing._id;
    }

    return await ctx.db.insert("teamMembers", {
      teamId: args.teamId,
      userId: args.userId,
      role: args.role,
    });
  },
});

export const removeUser = mutation({
  args: {
    teamId: v.id("teams"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getUserIdOrThrow(ctx);
    await requireTeamAccess(ctx, args.teamId, currentUserId, "admin");

    if (args.userId === currentUserId) {
      throw new Error("Cannot remove yourself from team");
    }

    const teamMember = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) => q.eq("teamId", args.teamId).eq("userId", args.userId))
      .first();

    if (teamMember) {
      await ctx.db.delete(teamMember._id);
    }
  },
});

export const updateUserRole = mutation({
  args: {
    teamId: v.id("teams"),
    userId: v.id("users"),
    role: teamRoleValidator,
  },
  handler: async (ctx, args) => {
    const currentUserId = await getUserIdOrThrow(ctx);
    await requireTeamAccess(ctx, args.teamId, currentUserId, "admin");

    const teamMember = await ctx.db
      .query("teamMembers")
      .withIndex("by_team_and_user", (q) => q.eq("teamId", args.teamId).eq("userId", args.userId))
      .first();

    if (!teamMember) {
      throw new Error("User is not a member of this team");
    }

    await ctx.db.patch(teamMember._id, { role: args.role });
  },
});
