import { tool } from "ai";
import { z } from "zod";

export function createGetChatHistoryTool() {
  return tool({
    description: "Get the full chat history for a file thread when you need to reference past conversation.",
    inputSchema: z.object({
      fileId: z.string().optional().describe("File ID (optional, uses current fileId if not provided)"),
      threadId: z.string().optional().describe("Thread ID (optional, uses current thread if not provided)"),
    }),
    execute: async () => {
      return JSON.stringify({ clientSide: true });
    },
  });
}
