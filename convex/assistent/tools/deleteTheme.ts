import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createThemeDeleteTool(projectId: Id<"projects">) {
  return tool({
    description: "Delete a theme",
    inputSchema: z.object({
      themeId: z.string().describe("Theme ID"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Theme "${params.themeId}" is being deleted from project "${params.projectId || projectId}"`,
        clientSide: true,
      });
    },
  });
}
