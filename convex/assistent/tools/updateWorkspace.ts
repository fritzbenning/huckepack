import { tool } from "ai";
import { z } from "zod";

export function createWorkspaceUpdateTool() {
  return tool({
    description: "Update an existing workspace",
    inputSchema: z.object({
      id: z.string().describe("Workspace ID"),
      name: z.string().describe("New workspace name"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Workspace "${params.id}" is being updated with new name "${params.name}"`,
        clientSide: true,
      });
    },
  });
}
