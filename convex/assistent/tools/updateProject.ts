import { tool } from "ai";
import { z } from "zod";

export function createProjectUpdateTool() {
  return tool({
    description: "Update an existing project",
    inputSchema: z.object({
      id: z.string().describe("Project ID"),
      name: z.string().describe("New project name (optional)"),
      description: z.string().describe("New project description (optional)"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Project "${params.id}" is being updated`,
        clientSide: true,
      });
    },
  });
}
