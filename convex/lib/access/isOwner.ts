import type { Id, TableNames } from "../../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../../_generated/server";

export async function isOwner(
  ctx: QueryCtx | MutationCtx,
  entityId: Id<TableNames>,
  userId: Id<"users">
): Promise<boolean> {
  const entity = await ctx.db.get(entityId);
  if (!entity) {
    return false;
  }

  if ("ownerId" in entity && entity.ownerId === userId) {
    return true;
  }

  return false;
}
