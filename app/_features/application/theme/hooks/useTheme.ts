import { useElectron } from "@hooks/application/useElectron";
import { withoutTransition } from "@shared/utils/interface";
import { useEffect, useRef } from "react";
import { getInitialThemeMode } from "../services/getInitialThemeMode";
import { updateElectronTheme } from "../services/updateElectronTheme";
import { updateWindowVibrancy } from "../services/updateWindowVibrancy";
import { useApplicationThemeStore } from "../stores/applicationThemeStore";
import type { IntegratedThemeActions, IntegratedThemeState, ThemeMode } from "../types";

export function useTheme(): IntegratedThemeState & IntegratedThemeActions {
  const isElectron = useElectron();
  const hasInitialized = useRef(false);

  const themeMode = useApplicationThemeStore((state) => state.themeMode);
  const setThemeMode = useApplicationThemeStore((state) => state.setThemeMode);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (isElectron || themeMode === "system") {
      getInitialThemeMode(isElectron).then((initialMode) => {
        if (initialMode !== themeMode) {
          setThemeMode(initialMode);
        }
      });
    }
  }, [isElectron, setThemeMode, themeMode]);

  const updateThemeMode = (themeMode: ThemeMode, isElectron: boolean) => {
    setThemeMode(themeMode);

    withoutTransition(() => {
      if (isElectron) {
        updateElectronTheme(themeMode);
        updateWindowVibrancy(themeMode === "dark" ? "dark" : "light");
      }

      document.documentElement.classList.toggle("dark", themeMode === "dark");
      document.documentElement.style.colorScheme = themeMode === "dark" ? "dark" : "light";
    });
  };

  const toggleThemeMode = () => {
    const newThemeMode = themeMode === "dark" ? "light" : "dark";
    updateThemeMode(newThemeMode, isElectron);
  };

  const setThemeModeWrapper = (mode: ThemeMode) => {
    updateThemeMode(mode, isElectron);
  };

  return {
    isDarkMode: themeMode === "dark",
    themeMode,
    setThemeMode: setThemeModeWrapper,
    toggleThemeMode,
  };
}
