import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createNodeClassReplaceTool(projectId: Id<"projects">, fileId: Id<"files">) {
  return tool({
    description: "Replace a CSS class with another class on the selected DOM element",
    inputSchema: z.object({
      oldClassName: z.string().describe("CSS class name to replace"),
      newClassName: z.string().describe("New CSS class name"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      fileId: z.string().optional().describe("File ID (defaults to current file)"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Replacing CSS class "${params.oldClassName}" with "${params.newClassName}" on selected node`,
        clientSide: true,
        projectId: params.projectId || projectId,
        fileId: params.fileId || fileId,
      });
    },
  });
}
