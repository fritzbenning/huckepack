import { internal } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { ActionCtx } from "@convex/_generated/server";
import { tool } from "ai";
import { z } from "zod";
import { ErrorMessages } from "./errorMessages";

export function createGetTailwindThemeTool(ctx: ActionCtx, projectId: Id<"projects">, tailwindTheme?: string) {
  return tool({
    description:
      "Get the current tailwind theme CSS with design tokens and custom properties for the current project. If tailwindTheme is available in context, returns it directly without querying.",
    inputSchema: z.object({}),
    execute: async () => {
      if (tailwindTheme) {
        return tailwindTheme;
      }

      try {
        const theme = await ctx.runQuery(internal.themes.getTailwindThemeForProjectInternal, { projectId });

        if (!theme) {
          return ErrorMessages.themeNotFound();
        }

        const themeContent = theme.currentContent || theme.content;

        if (!themeContent) {
          return ErrorMessages.themeEmpty();
        }
        return themeContent;
      } catch (error) {
        return ErrorMessages.genericError("retrieving tailwind theme", error);
      }
    },
  });
}
