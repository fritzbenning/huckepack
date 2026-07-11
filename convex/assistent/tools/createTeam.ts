import { tool } from "ai";
import { z } from "zod";

export function createTeamCreateTool() {
  return tool({
    description: "Create a new team within a workspace",
    inputSchema: z.object({
      workspaceId: z.string().describe("Workspace ID"),
      name: z.string().describe("Team name"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Team "${params.name}" is being created in workspace "${params.workspaceId}"`,
        clientSide: true,
      });
    },
  });
}
