import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createThemeUpdateTool(projectId: Id<"projects">) {
  return tool({
    description: "Update a theme's content",
    inputSchema: z.object({
      themeId: z.string().describe("Theme ID"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      content: z.record(z.string(), z.unknown()).describe("Updated theme CSS content"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Theme "${params.themeId}" is being updated in project "${params.projectId || projectId}"`,
        clientSide: true,
      });
    },
  });
}
