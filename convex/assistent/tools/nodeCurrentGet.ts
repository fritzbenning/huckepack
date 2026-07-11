import { tool } from "ai";
import { z } from "zod";

export function createNodeCurrentGetTool() {
  return tool({
    description: "Get the currently selected DOM element in the canvas",
    inputSchema: z.object({}),
    execute: async () => {
      return JSON.stringify({
        success: true,
        message: "Fetching currently selected node from canvas",
        clientSide: true,
      });
    },
  });
}
