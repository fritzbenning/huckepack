import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createNodeClassAddTool(projectId: Id<"projects">, fileId: Id<"files">) {
  return tool({
    description: "Add CSS classes to the selected DOM element",
    inputSchema: z.object({
      className: z.string().describe("CSS class name to add"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      fileId: z.string().optional().describe("File ID (defaults to current file)"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Adding CSS class "${params.className}" to selected node`,
        clientSide: true,
        projectId: params.projectId || projectId,
        fileId: params.fileId || fileId,
      });
    },
  });
}
