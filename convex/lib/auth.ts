import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "../_generated/dataModel";
import type { ActionCtx, MutationCtx, QueryCtx } from "../_generated/server";

export async function getUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users"> | null> {
  return await getAuthUserId(ctx);
}

export async function getUserIdOrThrow(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized - user must be authenticated");
  }
  return userId;
}

export async function getUserIdFromAction(ctx: ActionCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Unauthorized - user must be authenticated");
  }
  return userId;
}

export async function getCurrentUser(ctx: QueryCtx | MutationCtx): Promise<Doc<"users">> {
  const userId = await getUserIdOrThrow(ctx);
  const user = await ctx.db.get(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
