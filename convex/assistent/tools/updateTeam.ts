import { tool } from "ai";
import { z } from "zod";

export function createTeamUpdateTool() {
  return tool({
    description: "Update an existing team",
    inputSchema: z.object({
      id: z.string().describe("Team ID"),
      name: z.string().describe("New team name"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Team "${params.id}" is being updated with new name "${params.name}"`,
        clientSide: true,
      });
    },
  });
}
