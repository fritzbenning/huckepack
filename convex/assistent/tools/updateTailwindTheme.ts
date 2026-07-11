import { internal } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { ActionCtx } from "@convex/_generated/server";
import { tool } from "ai";
import { z } from "zod";
import { ErrorMessages } from "./errorMessages";

export function createUpdateTailwindThemeTool(ctx: ActionCtx, projectId: Id<"projects">) {
  return tool({
    description: "Update the tailwind theme CSS with design tokens and custom properties for the current project",
    inputSchema: z.object({
      content: z.string().describe("The complete tailwind theme CSS content to update"),
    }),
    execute: async ({ content }: { content: string }) => {
      try {
        const updatedContent = await ctx.runMutation(internal.themes.updateTailwindThemeForProjectInternal, {
          projectId,
          content,
        });

        return updatedContent;
      } catch (error) {
        return ErrorMessages.genericError("updating tailwind theme", error);
      }
    },
  });
}
