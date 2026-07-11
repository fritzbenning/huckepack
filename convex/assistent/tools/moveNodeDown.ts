import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createNodeMoveDownTool(projectId: Id<"projects">, fileId: Id<"files">) {
  return tool({
    description:
      "Move a node down one position in its parent's children array. For flex-col containers, moves visually down. For flex-row containers, moves right.",
    inputSchema: z.object({
      nodeId: z.string().describe("The ID of the node to move"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      fileId: z.string().optional().describe("File ID (defaults to current file)"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Moving node "${params.nodeId}" down one position`,
        clientSide: true,
        projectId: params.projectId || projectId,
        fileId: params.fileId || fileId,
      });
    },
  });
}
