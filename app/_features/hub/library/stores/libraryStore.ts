import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type FileView = "grid" | "list";

interface LibraryStore {
  currentProjectId: string | null;
  fileView: FileView;
}

interface LibraryStoreActions {
  setFileView: (view: FileView) => void;
}

const initialState: LibraryStore = {
  currentProjectId: null,
  fileView: "list",
};

export const useLibraryStore = create<LibraryStore & LibraryStoreActions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setFileView: (view: FileView) => {
          set({ fileView: view });
        },
      }),
      {
        name: "library-store",
        partialize: (state) => ({
          currentProjectId: state.currentProjectId,
          fileView: state.fileView,
        }),
      }
    )
  )
);

// Standalone setter functions
export const setCurrentProjectId = (currentProjectId: string | null) => {
  useLibraryStore.setState({ currentProjectId });
};

export const reset = () => {
  useLibraryStore.setState(initialState);
};
