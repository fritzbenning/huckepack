import { tool } from "ai";
import { z } from "zod";

export function createProjectDeleteTool() {
  return tool({
    description: "Delete a project",
    inputSchema: z.object({
      id: z.string().describe("Project ID"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Project "${params.id}" is being deleted`,
        clientSide: true,
      });
    },
  });
}
