import type { Id } from "../../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../../_generated/server";
import { hasWorkspaceRole, type WorkspaceRole } from "../roles";

export async function requireWorkspaceAccess(
  ctx: QueryCtx | MutationCtx,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">,
  minRole?: WorkspaceRole
): Promise<void> {
  const workspace = await ctx.db.get(workspaceId);
  if (!workspace) {
    throw new Error("Workspace not found");
  }

  if (workspace.ownerId === userId) {
    return;
  }

  const workspaceMember = await ctx.db
    .query("workspaceMembers")
    .withIndex("by_workspace_and_user", (q) => q.eq("workspaceId", workspaceId).eq("userId", userId))
    .first();

  if (!workspaceMember) {
    throw new Error("Unauthorized - user is not a member of this workspace");
  }

  if (minRole && !hasWorkspaceRole(workspaceMember.role as WorkspaceRole, minRole)) {
    throw new Error(`Unauthorized - user must have at least ${minRole} role in workspace`);
  }
}
