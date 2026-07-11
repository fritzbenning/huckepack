import { internal } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { ActionCtx } from "@convex/_generated/server";
import { tool } from "ai";
import { z } from "zod";
import { ErrorMessages } from "./errorMessages";

export function createUpdateFileContentTool(ctx: ActionCtx, fileId: Id<"files">, userId?: Id<"users">) {
  return tool({
    description: "Update the code content of the current file",
    inputSchema: z.object({
      content: z.string().describe("The complete file content to update"),
    }),
    execute: async ({ content }: { content: string }) => {
      try {
        if (!userId) {
          return ErrorMessages.userIdRequired();
        }

        const updatedContent = await ctx.runMutation(internal.files.updateFileContentInternal, {
          fileId,
          content,
          userId,
        });

        return updatedContent;
      } catch (error) {
        return ErrorMessages.genericError("updating file content", error);
      }
    },
  });
}
