import { tool } from "ai";
import { z } from "zod";

export function createWorkspaceCreateTool() {
  return tool({
    description: "Create a new workspace",
    inputSchema: z.object({
      name: z.string().describe("Workspace name"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Workspace "${params.name}" is being created`,
        clientSide: true,
      });
    },
  });
}
