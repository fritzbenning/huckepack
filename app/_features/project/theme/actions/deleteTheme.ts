import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";

export interface DeleteThemeParams {
  themeId: string;
  projectId: string;
}

export interface DeleteThemeResult {
  success: boolean;
  error?: string;
}

/**
 * Delete a theme.
 * Uses Convex mutation for reactive updates.
 */
export async function deleteTheme(params: DeleteThemeParams): Promise<DeleteThemeResult> {
  const { themeId } = params;

  try {
    await convex.mutation(api.themes.delete_, {
      id: themeId as Id<"themes">,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in deleteTheme action:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete theme",
    };
  }
}
