import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createFileUpdateTool(projectId: Id<"projects">, fileId: Id<"files">) {
  return tool({
    description: "Update file metadata (name, tags, etc.)",
    inputSchema: z.object({
      fileId: z.string().optional().describe("File ID (defaults to current file)"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      name: z.string().describe("New file name (optional)"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `File "${params.fileId || fileId}" is being updated`,
        clientSide: true,
      });
    },
  });
}
