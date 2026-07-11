import { convex } from "@lib/convex";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { ThemeWithVersion } from "../types.d";

export interface GetThemeParams {
  themeId: string;
}

export interface GetThemeResult {
  success: boolean;
  theme?: ThemeWithVersion | null;
  error?: string;
}

/**
 * Get a theme with its current version.
 * Uses Convex query for reactive data fetching.
 */
export async function getTheme(params: GetThemeParams): Promise<GetThemeResult> {
  const { themeId } = params;

  try {
    const theme = await convex.query(api.themes.getWithVersion, {
      themeId: themeId as Id<"themes">,
    });

    if (!theme) {
      return {
        success: false,
        error: "Theme not found",
      };
    }

    // Map Convex theme to ThemeWithVersion format
    const themeWithVersion: ThemeWithVersion = {
      id: theme._id,
      project_id: theme.projectId,
      name: theme.name,
      repository_path: theme.repositoryPath || null,
      current_version: theme.currentContent
        ? {
            id: theme.currentVersion,
            content: theme.currentContent,
          }
        : null,
      created_at: new Date(theme.createdAt).toISOString(),
    };

    return {
      success: true,
      theme: themeWithVersion,
    };
  } catch (error) {
    console.error("Error in getTheme action:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch theme",
    };
  }
}
