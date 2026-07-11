import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AssistentStore {
  threadIdsByFileId: Record<string, string>;
}

interface AssistentActions {
  setThreadId: (fileId: string, threadId: string | null) => void;
  getThreadId: (fileId: string) => string | null;
}

const initialState: AssistentStore = {
  threadIdsByFileId: {},
};

export const useAssistentStore = create<AssistentStore & AssistentActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setThreadId: (fileId: string, threadId: string | null) => {
          set((state) => {
            if (threadId === null) {
              const { [fileId]: _, ...rest } = state.threadIdsByFileId;
              return { threadIdsByFileId: rest };
            }
            return {
              threadIdsByFileId: {
                ...state.threadIdsByFileId,
                [fileId]: threadId,
              },
            };
          });
        },

        getThreadId: (fileId: string) => {
          return get().threadIdsByFileId[fileId] || null;
        },
      }),
      {
        name: "assistent-store",
        partialize: (state) => ({
          threadIdsByFileId: state.threadIdsByFileId,
        }),
      }
    ),
    {
      name: "assistent-store",
    }
  )
);

export const setThreadId = (fileId: string, threadId: string | null) => {
  useAssistentStore.getState().setThreadId(fileId, threadId);
};

export const getThreadId = (fileId: string): string | null => {
  return useAssistentStore.getState().getThreadId(fileId);
};
