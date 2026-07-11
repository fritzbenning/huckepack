import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createNodeClassUpdateTool(projectId: Id<"projects">, fileId: Id<"files">) {
  return tool({
    description: "Add and remove CSS classes from the selected DOM element in a single atomic operation",
    inputSchema: z.object({
      classesToAdd: z.array(z.string()).describe("Array of CSS class names to add"),
      classesToRemove: z.array(z.string()).describe("Array of CSS class names to remove"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      fileId: z.string().optional().describe("File ID (defaults to current file)"),
    }),
    execute: async (params) => {
      const addCount = params.classesToAdd?.length || 0;
      const removeCount = params.classesToRemove?.length || 0;
      return JSON.stringify({
        success: true,
        message: `Updating CSS classes: adding ${addCount} class(es), removing ${removeCount} class(es)`,
        clientSide: true,
        projectId: params.projectId || projectId,
        fileId: params.fileId || fileId,
      });
    },
  });
}
