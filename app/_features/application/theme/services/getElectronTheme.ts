import type { ThemeMode } from "../types";

export const getElectronTheme = async (): Promise<ThemeMode | null> => {
  if (!window.electron?.theme) {
    return null;
  }

  try {
    return await window.electron.theme.getTheme();
  } catch (error) {
    console.error("Failed to set Electron theme:", error);
    return null;
  }
};
