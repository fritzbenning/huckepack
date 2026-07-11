import { tool } from "ai";
import { z } from "zod";

export function createDisplayDesignTokensTool() {
  return tool({
    description:
      "Display one or multiple design tokens in a visually appealing way. Use this tool when you want to show design tokens to the user, such as colors, typography, spacing, shadows, borders, or border radius values.",
    inputSchema: z.object({
      tokens: z
        .array(
          z.object({
            name: z.string().describe("The name/title of the design token"),
            value: z.string().describe("The value of the design token (e.g., color hex, size, etc.)"),
            type: z
              .enum(["color", "typography", "spacing", "shadow", "border", "radius"])
              .describe("The type of design token"),
            description: z.string().optional().describe("Optional description of the design token"),
          })
        )
        .min(1)
        .describe("Array of design tokens to display"),
    }),
    execute: async () => {
      return JSON.stringify({ clientSide: true });
    },
  });
}
