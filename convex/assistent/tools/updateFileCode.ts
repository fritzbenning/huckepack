import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createFileUpdateCodeTool(projectId: Id<"projects">, fileId: Id<"files">) {
  return tool({
    description: "Update the code content of a file",
    inputSchema: z.object({
      fileId: z.string().optional().describe("File ID (defaults to current file)"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      updatedCode: z.string().describe("New file code"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Code for file "${params.fileId || fileId}" is being updated`,
        clientSide: true,
      });
    },
  });
}
