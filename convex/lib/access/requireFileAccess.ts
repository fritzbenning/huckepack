import type { Id } from "../../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../../_generated/server";
import type { TeamRole } from "../roles";
import { requireProjectAccess } from "./requireProjectAccess";

export async function requireFileAccess(
  ctx: QueryCtx | MutationCtx,
  fileId: Id<"files">,
  userId: Id<"users">,
  minRole?: TeamRole
): Promise<void> {
  const file = await ctx.db.get(fileId);
  if (!file) {
    throw new Error("File not found");
  }

  if (file.ownerId === userId) {
    return;
  }

  await requireProjectAccess(ctx, file.projectId, userId, minRole);
}
