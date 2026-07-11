import { tool } from "ai";
import { z } from "zod";

export function createWorkspaceDeleteTool() {
  return tool({
    description: "Delete a workspace",
    inputSchema: z.object({
      id: z.string().describe("Workspace ID"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Workspace "${params.id}" is being deleted`,
        clientSide: true,
      });
    },
  });
}
