export type ThemeMode = "light" | "dark" | "system";

export interface IntegratedThemeState {
  isDarkMode: boolean;
  themeMode: ThemeMode;
}

export interface IntegratedThemeActions {
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
}
