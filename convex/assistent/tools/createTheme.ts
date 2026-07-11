import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createThemeCreateTool(projectId: Id<"projects">) {
  return tool({
    description: "Create a new theme in a project",
    inputSchema: z.object({
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      name: z.string().describe("Theme name"),
      content: z.record(z.string(), z.unknown()).describe("Theme CSS content"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Theme "${params.name}" is being created in project "${params.projectId || projectId}"`,
        clientSide: true,
      });
    },
  });
}
