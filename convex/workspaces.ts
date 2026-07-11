import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { requireWorkspaceAccess } from "./lib/access";
import { getUserIdOrThrow } from "./lib/auth";
import { workspaceRoleValidator } from "./lib/validators";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx);

    const workspaceMembers = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    const ownedWorkspaces = await ctx.db
      .query("workspaces")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", userId))
      .collect();

    const workspaceIds = new Set<Id<"workspaces">>();
    ownedWorkspaces.forEach((w) => {
      workspaceIds.add(w._id);
    });
    workspaceMembers.forEach((wm) => {
      workspaceIds.add(wm.workspaceId);
    });

    const workspaces = await Promise.all(Array.from(workspaceIds).map((id) => ctx.db.get(id)));

    const validWorkspaces = workspaces.filter((w) => w !== null);

    const personalTeam = await ctx.db
      .query("teams")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", userId))
      .filter((q) => q.eq(q.field("name"), "Personal"))
      .first();

    const personalWorkspaceId = personalTeam?.workspaceId;

    return validWorkspaces.filter((w) => w._id !== personalWorkspaceId);
  },
});

export const get = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireWorkspaceAccess(ctx, args.workspaceId, userId);
    return await ctx.db.get(args.workspaceId);
  },
});

export const getUsers = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireWorkspaceAccess(ctx, args.workspaceId, userId);

    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      return [];
    }

    const workspaceMembers = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    const userIds = new Set<Id<"users">>();
    workspaceMembers.forEach((wm) => {
      userIds.add(wm.userId);
    });
    if (workspace.ownerId) {
      userIds.add(workspace.ownerId);
    }

    const users = await Promise.all(Array.from(userIds).map((id) => ctx.db.get(id)));

    return users
      .filter((u) => u !== null)
      .map((u) => {
        const isOwner = u!._id === workspace.ownerId;
        const workspaceMember = workspaceMembers.find((wm) => wm.userId === u!._id);
        return {
          user: u!,
          role: isOwner ? ("owner" as const) : (workspaceMember?.role ?? "member"),
        };
      });
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const ownerId = await getUserIdOrThrow(ctx);
    const now = Date.now();

    const workspaceId = await ctx.db.insert("workspaces", {
      ownerId,
      name: args.name,
      createdAt: now,
    });

    await ctx.db.insert("workspaceMembers", {
      workspaceId,
      userId: ownerId,
      role: "owner",
    });

    return workspaceId;
  },
});

export const ensurePersonalWorkspace = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserIdOrThrow(ctx);
    const now = Date.now();

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const userName = user.name || user.email?.split("@")[0] || "User";

    const ownedWorkspaces = await ctx.db
      .query("workspaces")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", userId))
      .collect();

    if (ownedWorkspaces.length > 0) {
      const workspace = ownedWorkspaces[0];
      const teams = await ctx.db
        .query("teams")
        .withIndex("by_owner_id", (q) => q.eq("ownerId", userId))
        .collect();

      if (teams.length > 0) {
        return { workspaceId: workspace._id, teamId: teams[0]._id };
      }

      const teamId = await ctx.db.insert("teams", {
        workspaceId: workspace._id,
        ownerId: userId,
        name: "Personal",
        createdAt: now,
      });

      await ctx.db.insert("teamMembers", {
        teamId,
        userId,
        role: "owner",
      });

      return { workspaceId: workspace._id, teamId };
    }

    const workspaceId = await ctx.db.insert("workspaces", {
      ownerId: userId,
      name: `${userName}'s Workspace`,
      createdAt: now,
    });

    await ctx.db.insert("workspaceMembers", {
      workspaceId,
      userId,
      role: "owner",
    });

    const teamId = await ctx.db.insert("teams", {
      workspaceId,
      ownerId: userId,
      name: "Personal",
      createdAt: now,
    });

    await ctx.db.insert("teamMembers", {
      teamId,
      userId,
      role: "owner",
    });

    return { workspaceId, teamId };
  },
});

export const update = mutation({
  args: {
    id: v.id("workspaces"),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireWorkspaceAccess(ctx, args.id, userId, "admin");

    const updates: { name?: string } = {};
    if (args.name !== undefined) {
      updates.name = args.name;
    }

    await ctx.db.patch(args.id, updates);
  },
});

export const delete_ = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireWorkspaceAccess(ctx, args.id, userId, "owner");

    // Get all teams in this workspace
    const teams = await ctx.db
      .query("teams")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
      .collect();

    // Delete all teams (this will cascade delete projects, files, themes, etc.)
    for (const team of teams) {
      // Get all projects in this team
      const projects = await ctx.db
        .query("projects")
        .withIndex("by_team_id", (q) => q.eq("teamId", team._id))
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

      // Unpin team if pinned
      const pinnedTeam = await ctx.db
        .query("pinnedItems")
        .withIndex("by_user_and_entity", (q) =>
          q.eq("userId", userId).eq("entityType", "team").eq("entityId", team._id)
        )
        .first();
      if (pinnedTeam) {
        await ctx.db.delete(pinnedTeam._id);
      }

      // Delete team
      await ctx.db.delete(team._id);
    }

    // Clean up workspace members
    const workspaceMembers = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.id))
      .collect();
    for (const member of workspaceMembers) {
      await ctx.db.delete(member._id);
    }

    // Unpin workspace if pinned
    const pinnedWorkspace = await ctx.db
      .query("pinnedItems")
      .withIndex("by_user_and_entity", (q) =>
        q.eq("userId", userId).eq("entityType", "workspace").eq("entityId", args.id)
      )
      .first();
    if (pinnedWorkspace) {
      await ctx.db.delete(pinnedWorkspace._id);
    }

    // Delete workspace
    await ctx.db.delete(args.id);
  },
});

export const addUser = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
    role: workspaceRoleValidator,
  },
  handler: async (ctx, args) => {
    const currentUserId = await getUserIdOrThrow(ctx);
    await requireWorkspaceAccess(ctx, args.workspaceId, currentUserId, "admin");

    const existing = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_and_user", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", args.userId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { role: args.role });
      return existing._id;
    }

    return await ctx.db.insert("workspaceMembers", {
      workspaceId: args.workspaceId,
      userId: args.userId,
      role: args.role,
    });
  },
});

export const removeUser = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getUserIdOrThrow(ctx);
    await requireWorkspaceAccess(ctx, args.workspaceId, currentUserId, "admin");

    if (args.userId === currentUserId) {
      throw new Error("Cannot remove yourself from workspace");
    }

    const workspaceMember = await ctx.db
      .query("workspaceMembers")
      .withIndex("by_workspace_and_user", (q) => q.eq("workspaceId", args.workspaceId).eq("userId", args.userId))
      .first();

    if (workspaceMember) {
      await ctx.db.delete(workspaceMember._id);
    }
  },
});
