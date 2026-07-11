import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createNodeMoveUpTool(projectId: Id<"projects">, fileId: Id<"files">) {
  return tool({
    description:
      "Move a node up one position in its parent's children array. For flex-col containers, moves visually up. For flex-row containers, moves left.",
    inputSchema: z.object({
      nodeId: z.string().describe("The ID of the node to move"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      fileId: z.string().optional().describe("File ID (defaults to current file)"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Moving node "${params.nodeId}" up one position`,
        clientSide: true,
        projectId: params.projectId || projectId,
        fileId: params.fileId || fileId,
      });
    },
  });
}
