import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";
import { DEFAULT_TAILWIND_THEME } from "../../theme-version/presets/defaultTailwindTheme";
import type { Theme } from "../types";

export const createTheme = async (params: {
  name: string;
  projectId: string;
  repositoryPath?: string;
}): Promise<Theme> => {
  const themeId = await convex.mutation(api.themes.create, {
    projectId: params.projectId as Id<"projects">,
    name: params.name,
    repositoryPath: params.repositoryPath,
    content: DEFAULT_TAILWIND_THEME,
  });

  if (!themeId) {
    throw new Error("Failed to create theme");
  }

  const themeData = await convex.query(api.themes.get, { themeId });
  if (!themeData) {
    throw new Error("Failed to fetch created theme");
  }

  const theme: Theme = {
    id: themeData._id,
    name: themeData.name,
    project_id: themeData.projectId,
    repository_path: themeData.repositoryPath || null,
    current_version_id: null,
    created_at: new Date(themeData.createdAt).toISOString(),
  };

  return theme;
};
