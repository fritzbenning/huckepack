import type { Id } from "../../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../../_generated/server";
import { hasTeamRole, type TeamRole } from "../roles";

export async function requireTeamAccess(
  ctx: QueryCtx | MutationCtx,
  teamId: Id<"teams">,
  userId: Id<"users">,
  minRole?: TeamRole
): Promise<void> {
  const team = await ctx.db.get(teamId);
  if (!team) {
    throw new Error("Team not found");
  }

  if (team.ownerId === userId) {
    return;
  }

  const teamMember = await ctx.db
    .query("teamMembers")
    .withIndex("by_team_and_user", (q) => q.eq("teamId", teamId).eq("userId", userId))
    .first();

  if (!teamMember) {
    throw new Error("Unauthorized - user is not a member of this team");
  }

  if (minRole && !hasTeamRole(teamMember.role as TeamRole, minRole)) {
    throw new Error(`Unauthorized - user must have at least ${minRole} role in team`);
  }
}
