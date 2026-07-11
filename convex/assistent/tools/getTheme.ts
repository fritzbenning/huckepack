import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createThemeGetTool(projectId: Id<"projects">) {
  return tool({
    description: "Get an existing theme",
    inputSchema: z.object({
      themeId: z.string().describe("Theme ID"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Fetching theme "${params.themeId}" from project "${params.projectId || projectId}"`,
        clientSide: true,
      });
    },
  });
}
