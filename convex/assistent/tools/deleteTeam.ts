import { tool } from "ai";
import { z } from "zod";

export function createTeamDeleteTool() {
  return tool({
    description: "Delete a team",
    inputSchema: z.object({
      id: z.string().describe("Team ID"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Team "${params.id}" is being deleted`,
        clientSide: true,
      });
    },
  });
}
