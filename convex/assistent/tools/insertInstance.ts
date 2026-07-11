import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createInstanceInsertTool(projectId: Id<"projects">, targetFileId: Id<"files">) {
  return tool({
    description:
      "Insert an existing component instance from the project into the canvas. Adds the import statement and creates a JSX element with mandatory props.",
    inputSchema: z.object({
      instanceFileId: z.string().describe("File ID of the component instance to insert"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      targetFileId: z
        .string()
        .optional()
        .describe("File ID where the component instance will be inserted (defaults to current file)"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Inserting component instance from file "${params.instanceFileId}" into canvas`,
        clientSide: true,
        projectId: params.projectId || projectId,
        targetFileId: params.targetFileId || targetFileId,
      });
    },
  });
}
