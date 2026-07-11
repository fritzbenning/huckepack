import { convex } from "@lib/convex";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export interface UpdateThemeParams {
  themeId: string;
  projectId: string;
  content: string;
}

export interface UpdateThemeResult {
  success: boolean;
  error?: string;
}

/**
 * Update a theme's content.
 * Uses Convex mutation for reactive updates.
 */
export async function updateTheme(params: UpdateThemeParams): Promise<UpdateThemeResult> {
  const { themeId, content } = params;

  try {
    await convex.mutation(api.themes.update, {
      id: themeId as Id<"themes">,
      content,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in updateTheme action:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update theme",
    };
  }
}
