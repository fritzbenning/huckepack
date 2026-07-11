import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { ThemeMode } from "../types";

interface ApplicationThemeStore {
  themeMode: ThemeMode;
}

interface ApplicationThemeActions {
  setThemeMode: (mode: ThemeMode) => void;
}

const initialState: ApplicationThemeStore = {
  themeMode: "light",
};

export const useApplicationThemeStore = create<ApplicationThemeStore & ApplicationThemeActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setThemeMode: (mode: ThemeMode) => {
          set({ themeMode: mode });
        },
      }),
      {
        name: "application-theme-store",
        partialize: (state) => ({
          themeMode: state.themeMode,
        }),
      }
    ),
    {
      name: "application-theme",
    }
  )
);
