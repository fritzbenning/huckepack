import { internal } from "@convex/_generated/api";
import { tool } from "ai";
import { z } from "zod";
import type { Id } from "../../_generated/dataModel";
import type { ActionCtx } from "../../_generated/server";
import { ErrorMessages } from "./errorMessages";

export function createGetCurrentFileTool(ctx: ActionCtx, currentFileId?: Id<"files">) {
  return tool({
    description:
      "Get information about the currently open file (fileId, name, type, extension). Returns null if no file is currently open.",
    inputSchema: z.object({}),
    execute: async () => {
      if (!currentFileId) {
        return JSON.stringify({ currentFileId: null, message: "No file is currently open in context." });
      }

      try {
        const fileMetadata = await ctx.runQuery(internal.files.getFileMetadataInternal, {
          fileId: currentFileId,
        });

        if (!fileMetadata) {
          return JSON.stringify({
            currentFileId,
            message: ErrorMessages.fileNotFound(currentFileId),
          });
        }

        return JSON.stringify({
          currentFileId,
          name: fileMetadata.name,
          type: fileMetadata.type,
          extension: fileMetadata.extension,
          message: `Currently working on file: ${fileMetadata.name}`,
        });
      } catch (error) {
        return JSON.stringify({
          currentFileId,
          message: ErrorMessages.genericError("retrieving current file", error),
        });
      }
    },
  });
}
