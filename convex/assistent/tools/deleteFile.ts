import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createFileDeleteTool(fileId: Id<"files">) {
  return tool({
    description: "Delete a file from a project",
    inputSchema: z.object({
      fileId: z
        .string()
        .optional()
        .describe(
          "File ID (defaults to current file). You can get the file ID using the 'getProjectFiles' tool first."
        ),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `File "${params.fileId || fileId}" is being deleted from project."`,
        clientSide: true,
      });
    },
  });
}
