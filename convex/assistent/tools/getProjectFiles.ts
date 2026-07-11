import { internal } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { ActionCtx } from "@convex/_generated/server";
import { tool } from "ai";
import { z } from "zod";
import { ErrorMessages } from "./errorMessages";

export function createGetProjectFilesTool(ctx: ActionCtx, projectId: Id<"projects">) {
  return tool({
    description:
      "Get metadata (name, id, type, extension) for all files in the current project. This returns only metadata, not file content.",
    inputSchema: z.object({}),
    execute: async () => {
      try {
        const files = await ctx.runQuery(internal.files.listMetadataInternal, { projectId });

        if (!files || files.length === 0) {
          return ErrorMessages.projectNotFound();
        }

        return JSON.stringify(
          files.map((file) => ({
            id: file._id,
            name: file.name,
            type: file.type,
            extension: file.extension,
            updatedAt: file.updatedAt,
          }))
        );
      } catch (error) {
        return ErrorMessages.genericError("retrieving project files", error);
      }
    },
  });
}
