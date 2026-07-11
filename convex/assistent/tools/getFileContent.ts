import { internal } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { ActionCtx } from "@convex/_generated/server";
import { tool } from "ai";
import { z } from "zod";
import { ErrorMessages } from "./errorMessages";

export function createGetFileContentTool(ctx: ActionCtx, currentFileId?: Id<"files">, fileIdFromContext?: Id<"files">) {
  return tool({
    description:
      "Get the code content of a specific file in the project. If fileId is not provided, uses currentFileId or fileId from context.",
    inputSchema: z.object({
      fileId: z
        .string()
        .optional()
        .describe("The ID of the file to get content for. If not provided, uses currentFileId or fileId from context."),
    }),
    execute: async ({ fileId }: { fileId?: string }) => {
      let targetFileId: Id<"files"> | undefined;

      if (fileId) {
        targetFileId = fileId as Id<"files">;
      } else if (fileIdFromContext) {
        targetFileId = fileIdFromContext;
      } else if (currentFileId) {
        targetFileId = currentFileId;
      }

      if (!targetFileId) {
        return ErrorMessages.fileIdRequired();
      }

      try {
        const file = await ctx.runQuery(internal.files.getFileInternal, {
          fileId: targetFileId,
        });

        if (!file) {
          return ErrorMessages.fileNotFound(targetFileId);
        }

        return file.code || "";
      } catch (error) {
        return ErrorMessages.genericError("retrieving file content", error);
      }
    },
  });
}
