import type { Id } from "@convex/_generated/dataModel";
import { tool } from "ai";
import { z } from "zod";

export function createNodeInsertTool(projectId: Id<"projects">, fileId: Id<"files">) {
  return tool({
    description:
      "Insert a new HTML/JSX element into the canvas. If a node is selected, inserts as the last child. If no node is selected, inserts at the top level.",
    inputSchema: z.object({
      elementType: z.string().describe("HTML element type (e.g., 'div', 'span', 'button', 'input', 'img')"),
      projectId: z.string().optional().describe("Project ID (defaults to current project)"),
      fileId: z.string().optional().describe("File ID (defaults to current file)"),
      customClasses: z.string().describe("Optional custom CSS classes to apply to the element"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `Inserting ${params.elementType} element into canvas`,
        clientSide: true,
        projectId: params.projectId || projectId,
        fileId: params.fileId || fileId,
      });
    },
  });
}
