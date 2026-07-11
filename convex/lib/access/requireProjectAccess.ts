import type { Id } from "../../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../../_generated/server";
import type { TeamRole } from "../roles";
import { requireTeamAccess } from "./requireTeamAccess";

export async function requireProjectAccess(
  ctx: QueryCtx | MutationCtx,
  projectId: Id<"projects">,
  userId: Id<"users">,
  minRole?: TeamRole
): Promise<void> {
  const project = await ctx.db.get(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  await requireTeamAccess(ctx, project.teamId, userId, minRole);
}
