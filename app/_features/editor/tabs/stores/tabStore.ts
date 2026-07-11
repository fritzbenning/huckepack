import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { OpenTab } from "../types";

interface TabStore {
  openTabs: OpenTab[];
}

const getInitialState = (): TabStore => ({
  openTabs: [],
});

// Create a single global tab store instance
export const useTabStore = create<TabStore>()(
  devtools(
    persist(() => getInitialState(), {
      name: "tab-store",
      partialize: (state) => ({
        openTabs: state.openTabs,
      }),
    }),
    {
      name: "tab-store",
    }
  )
);

const getStore = () => useTabStore.getState();
const setState = useTabStore.setState;

// Tab management functions
export const addTab = (id: string, title: string, projectId: string, type: "file" = "file") => {
  const currentTabs = getStore().openTabs;

  // Check if tab already exists
  const existingTab = currentTabs.find((tab) => tab.id === id);
  if (existingTab) {
    return; // Tab already exists, no need to add
  }

  // Add new tab
  setState((state) => ({
    openTabs: [...state.openTabs, { id, type, title, projectId }],
  }));
};

export const removeTab = (id: string) => {
  setState((state) => ({
    openTabs: state.openTabs.filter((tab) => tab.id !== id),
  }));
};

export const getTab = (id: string): OpenTab | undefined => {
  return getStore().openTabs.find((tab) => tab.id === id);
};

export const getAllTabs = (): OpenTab[] => {
  return getStore().openTabs;
};

export const isTabOpen = (id: string): boolean => {
  return getStore().openTabs.some((tab) => tab.id === id);
};

export const updateTabTitle = (id: string, newTitle: string) => {
  setState((state) => ({
    openTabs: state.openTabs.map((tab) => (tab.id === id ? { ...tab, title: newTitle } : tab)),
  }));
};

export const clearAllTabs = () => {
  setState(() => ({
    openTabs: [],
  }));
};

export const getTabCount = (): number => {
  return getStore().openTabs.length;
};

export const getTabsByProjectId = (projectId: string): OpenTab[] => {
  return getStore().openTabs.filter((tab) => tab.projectId === projectId);
};

export const removeTabsByProjectId = (projectId: string) => {
  setState((state) => ({
    openTabs: state.openTabs.filter((tab) => tab.projectId !== projectId),
  }));
};

export const getTabCountByProjectId = (projectId: string): number => {
  return getStore().openTabs.filter((tab) => tab.projectId === projectId).length;
};
