import type { ThemeVersion } from "../../theme/types";
import { db_createThemeVersion } from "../database/create";
import { DEFAULT_TAILWIND_THEME } from "../presets/defaultTailwindTheme";

export const createInitialThemeVersion = async (params: {
  themeId: string;
  themeName?: string;
  id?: string;
}): Promise<ThemeVersion | null> => {
  try {
    const { themeId, id } = params;

    const insertData = {
      ...(id && { id }),
      version: 1,
      theme_id: themeId,
      content: DEFAULT_TAILWIND_THEME,
    };

    const themeVersion = await db_createThemeVersion({
      data: insertData,
    });

    return themeVersion;
  } catch (error) {
    console.error("Error creating initial theme version:", error);
    return null;
  }
};
