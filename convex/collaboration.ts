import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireFileAccess } from "./lib/access";
import { getUserIdOrThrow } from "./lib/auth";

export const broadcastCodeChange = mutation({
  args: {
    fileId: v.id("files"),
    code: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserIdOrThrow(ctx);
    await requireFileAccess(ctx, args.fileId, userId, "editor");

    const file = await ctx.db.get(args.fileId);
    if (!file) {
      throw new Error("File not found");
    }

    const now = Date.now();

    await ctx.db.patch(args.fileId, {
      code: args.code,
      updatedAt: now,
      lastEditor: userId,
    });
  },
});
