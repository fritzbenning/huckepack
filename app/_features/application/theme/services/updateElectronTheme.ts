import type { ThemeMode } from "../types";

export const updateElectronTheme = async (theme: ThemeMode) => {
  if (!window.electron?.theme) {
    return;
  }

  try {
    await window.electron.theme.setTheme(theme);
  } catch (error) {
    console.error("Failed to set Electron theme:", error);
  }
};
