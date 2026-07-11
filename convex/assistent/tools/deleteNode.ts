import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createNodeDeleteTool(projectId: Id<"projects">, fileId: Id<"files">) {
  return tool({
    description: "Delete a JSX element node from the canvas by its node ID.",
    inputSchema: z.object({
      nodeId: z.string().describe("The ID of the node to delete"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      fileId: z.string().optional().describe("File ID (defaults to current file)"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Deleting node "${params.nodeId}" from canvas`,
        clientSide: true,
        projectId: params.projectId || projectId,
        fileId: params.fileId || fileId,
      });
    },
  });
}
