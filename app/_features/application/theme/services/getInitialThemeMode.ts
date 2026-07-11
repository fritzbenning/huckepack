import type { ThemeMode } from "../types";
import { getElectronTheme } from "./getElectronTheme";

export const getInitialThemeMode = async (isElectron: boolean): Promise<ThemeMode> => {
  if (isElectron) {
    const electronTheme = await getElectronTheme();
    return electronTheme || "system";
  }

  if (document.documentElement.classList.contains("dark")) {
    return "dark";
  }

  return "system";
};
