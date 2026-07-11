import type { Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

export async function upsertUserProfile(
  ctx: MutationCtx,
  args: {
    userId: Id<"users">;
    existingUserId: Id<"users"> | null;
    type: "oauth" | "credentials" | "email" | "phone" | "verification";
    provider: { id: string };
    profile: Record<string, unknown>;
    shouldLink?: boolean;
  }
) {
  const { existingUserId, profile, provider, userId } = args;

  const now = Date.now();
  const providerId = provider.id;

  // If this is a new user, ensure they have a personal workspace and team
  if (!existingUserId) {
    const user = await ctx.db.get(userId);
    if (user) {
      const userName = user.name || user.email?.split("@")[0] || "User";

      const ownedWorkspaces = await ctx.db
        .query("workspaces")
        .withIndex("by_owner_id", (q) => q.eq("ownerId", userId))
        .collect();

      if (ownedWorkspaces.length === 0) {
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
      } else {
        const teams = await ctx.db
          .query("teams")
          .withIndex("by_owner_id", (q) => q.eq("ownerId", userId))
          .collect();

        if (teams.length === 0) {
          const teamId = await ctx.db.insert("teams", {
            workspaceId: ownedWorkspaces[0]._id,
            ownerId: userId,
            name: "Personal",
            createdAt: now,
          });

          await ctx.db.insert("teamMembers", {
            teamId,
            userId,
            role: "owner",
          });
        }
      }
    }
  }

  // Update existing user profile
  if (existingUserId) {
    const updates: Record<string, unknown> = {
      updatedAt: now,
      lastSignInAt: now,
    };

    // Set provider-specific IDs
    if (providerId === "github" && profile.id) {
      updates.githubId = Number(profile.id);
    } else if (providerId === "google" && (profile.id || profile.sub)) {
      updates.googleId = (profile.id || profile.sub) as string;
    }

    await ctx.db.patch(existingUserId, updates);

    // Ensure existing users also have a personal workspace and team
    const ownedWorkspaces = await ctx.db
      .query("workspaces")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", existingUserId))
      .collect();

    if (ownedWorkspaces.length === 0) {
      const user = await ctx.db.get(existingUserId);
      const userName = user?.name || user?.email?.split("@")[0] || "User";
      const workspaceId = await ctx.db.insert("workspaces", {
        ownerId: existingUserId,
        name: `${userName}'s Workspace`,
        createdAt: now,
      });

      await ctx.db.insert("workspaceMembers", {
        workspaceId,
        userId: existingUserId,
        role: "owner",
      });

      const teamId = await ctx.db.insert("teams", {
        workspaceId,
        ownerId: existingUserId,
        name: "Personal",
        createdAt: now,
      });

      await ctx.db.insert("teamMembers", {
        teamId,
        userId: existingUserId,
        role: "owner",
      });
    } else {
      const teams = await ctx.db
        .query("teams")
        .withIndex("by_owner_id", (q) => q.eq("ownerId", existingUserId))
        .collect();

      if (teams.length === 0) {
        const teamId = await ctx.db.insert("teams", {
          workspaceId: ownedWorkspaces[0]._id,
          ownerId: existingUserId,
          name: "Personal",
          createdAt: now,
        });

        await ctx.db.insert("teamMembers", {
          teamId,
          userId: existingUserId,
          role: "owner",
        });
      }
    }
  }
}
