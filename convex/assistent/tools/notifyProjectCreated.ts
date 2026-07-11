import { tool } from "ai";
import { z } from "zod";

export function createNotifyProjectCreatedTool() {
  return tool({
    description: "Notify that a project has been created. This tool is used internally to communicate the project ID to the client.",
    inputSchema: z.object({
      projectId: z.string().describe("The ID of the created project"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        projectId: params.projectId,
      });
    },
  });
}

