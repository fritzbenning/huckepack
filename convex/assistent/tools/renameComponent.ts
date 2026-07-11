import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createFileRenameComponentTool(projectId: Id<"projects">, fileId: Id<"files">) {
  return tool({
    description: "Rename a React component in a file (updates component name and all JSX references)",
    inputSchema: z.object({
      fileId: z.string().optional().describe("File ID (defaults to current file)"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      oldComponentName: z.string().describe("Current component name"),
      newComponentName: z.string().describe("New component name"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Component "${params.oldComponentName}" is being renamed to "${params.newComponentName}" in file "${params.fileId || fileId}"`,
        clientSide: true,
      });
    },
  });
}
