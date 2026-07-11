import { tool } from "ai";
import { z } from "zod";

export const handoffToCoderTool = tool({
  description:
    "Delegate code editing tasks to the specialized coder agent. Use this when you need to edit code in a file.",
  inputSchema: z.object({
    fileId: z.string().optional().describe("The ID of the file to edit. If not provided, uses currentFileId."),
    instruction: z.string().describe("Clear instruction for what code changes to make"),
    tailwindTheme: z.string().optional().describe("Current tailwind theme CSS (optional, to avoid re-fetching)"),
    recentContext: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })
      )
      .optional()
      .describe("Last 2-3 messages for context (optional)"),
  }),
  execute: async (_params: {
    fileId?: string;
    instruction: string;
    tailwindTheme?: string;
    recentContext?: Array<{ role: "user" | "assistant"; content: string }>;
  }) => {
    return JSON.stringify({ handoff: true, agent: "coder" });
  },
});

export const handoffToComposerTool = tool({
  description: "Signal completion and return control to the composer agent.",
  inputSchema: z.object({
    summary: z.string().describe("Brief summary of what was accomplished"),
  }),
  execute: async (_params: { summary: string }) => {
    return JSON.stringify({ handoff: true, agent: "composer" });
  },
});

export const getChatHistoryTool = tool({
  description: "Get the full chat history for a file thread when you need to reference past conversation.",
  inputSchema: z.object({
    fileId: z.string().optional().describe("File ID (optional, uses currentFileId if not provided)"),
    threadId: z.string().optional().describe("Thread ID (optional, uses current thread if not provided)"),
  }),
  execute: async (_params: { fileId?: string; threadId?: string }) => {
    return JSON.stringify({ clientSide: true });
  },
});

export const displayDesignTokensTool = tool({
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
  execute: async ({
    tokens,
  }: {
    tokens: Array<{ name: string; value: string; type: string; description?: string }>;
  }) => {
    return JSON.stringify(tokens);
  },
});
