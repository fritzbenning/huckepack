import type { Id } from "@convex/_generated/dataModel";
import type { ToolCtx } from "@convex-dev/agent";

export type BaseToolCtx = ToolCtx & { projectId: Id<"projects"> };

export type ProjectToolCtx = BaseToolCtx & {
  currentFileId?: Id<"files">;
  userId?: Id<"users">;
};

export type FileToolCtx = BaseToolCtx & {
  fileId: Id<"files">;
  userId?: Id<"users">;
};









