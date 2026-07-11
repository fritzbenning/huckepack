import { convertToAST } from "@ast/convert";
import { createTransformedAST } from "@ast/utils";
import type { Id } from "@convex/_generated/dataModel";
import type { FileHistory } from "@editor/history/types";
import type { FlatTreeNode, HierarchicalTreeNode } from "@editor/layer-tree";
import type { FormattedParam, Properties } from "@project/ast-parser";
import { createDebouncedIndexedDBStorage } from "@shared/indexedDB";
import { toSlug } from "@shared/utils/format";
import { generateIdFromString } from "@shared/utils/hash";
import type { Module } from "@swc/wasm-web";
import type { UIMessage } from "ai";
import type { StoreApi } from "zustand";
import { create, useStore } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import type { ChatHistory, FileManagerItem } from "../types";

interface FileManagerStore {
  projectId: Id<"projects">;
  files: Record<Id<"files">, FileManagerItem>;
  sandpackFiles: Record<string, string>;
  lastChangedSandpackFile?: {
    path: string;
    timestamp: number;
  };
  _hasHydrated: boolean;
}

const getInitialState = (projectId: Id<"projects">): FileManagerStore => ({
  projectId,
  files: {},
  sandpackFiles: {},
  lastChangedSandpackFile: undefined,
  _hasHydrated: false,
});

// Store instances map
const instances: Map<number, StoreApi<FileManagerStore>> = new Map();

// Factory function to create store instances
export const createFileManagerStore = (projectId: Id<"projects">) => {
  const id = generateIdFromString(projectId);
  let hasCalledRehydrate = false;

  const store = create<FileManagerStore>()(
    devtools(
      persist(
        immer(() => getInitialState(projectId)),
        {
          name: `file-manager-store-${id}`,
          storage: createJSONStorage(() => createDebouncedIndexedDBStorage()),
          partialize: (state) => ({
            projectId: state.projectId,
            files: Object.fromEntries(
              Object.entries(state.files).map(([fileId, file]) => [
                fileId,
                {
                  ...file,
                  ast: null, // Exclude AST from persistence to avoid serialization issues
                  chatHistory: file.chatHistory, // Include chat history - IndexedDB has plenty of space!
                  activeThreadId: file.activeThreadId, // Include active thread ID
                  classSuggestions: file.classSuggestions, // Include class suggestions
                },
              ])
            ),
            sandpackFiles: state.sandpackFiles,
            // Exclude _hasHydrated from persistence
          }),
          onRehydrateStorage: () => (state, error) => {
            if (error) {
              console.error("[FileManagerStore] Rehydration error:", error);
              return;
            }
            // Use a closure variable to ensure we only set hydration once
            if (state && !hasCalledRehydrate) {
              hasCalledRehydrate = true;
              state._hasHydrated = true;
            }
          },
        }
      ),
      {
        name: `file-manager-${id}`,
      }
    )
  );

  return store;
};

// Get or create store instance
export const getFileManagerStore = (projectId: Id<"projects">): StoreApi<FileManagerStore> => {
  const id = generateIdFromString(projectId);
  if (!instances.has(id)) {
    instances.set(id, createFileManagerStore(projectId));
  }
  return instances.get(id)!;
};

// Hook to use in React components
export const useFileManagerStore = <T>(selector: (state: FileManagerStore) => T, projectId: Id<"projects">) => {
  const store = getFileManagerStore(projectId);
  return useStore(store, selector);
};

export const useStoreFile = (
  fileId: Id<"files"> | undefined,
  projectId: Id<"projects">
): { file: FileManagerItem | undefined; isHydrated: boolean } => {
  const store = getFileManagerStore(projectId);
  return useStore(
    store,
    useShallow((state) => ({
      file: fileId ? state.files[fileId] : undefined,
      isHydrated: state._hasHydrated,
    }))
  );
};

export const useStoreFiles = (projectId: Id<"projects">) => {
  const store = getFileManagerStore(projectId);
  return useStore(
    store,
    useShallow((state) => Object.values(state.files))
  );
};

// Get store instance helper
const getStoreByProjectId = (projectId: Id<"projects">) => {
  return getFileManagerStore(projectId);
};

// Helper to properly type setState with immer middleware
const setState = (store: StoreApi<FileManagerStore>, fn: (state: FileManagerStore) => void) => {
  (store.setState as (fn: (state: FileManagerStore) => void) => void)(fn);
};

const getDefaultHistory = (currentCode: string): FileHistory => ({
  history: [],
  historyPointer: 0,
  currentCode,
  diffCount: 0,
  versions: [],
});

export const updateFileStore = (
  id: Id<"files">,
  projectId: Id<"projects">,
  updates: {
    name?: string;
    slug?: string;
    lastEdit?: string | null;
    path?: string;
    code?: { reference: string; augmented: string; stateless: string; preview: string };
    codeType?: "reference" | "preview" | "augmented" | "stateless";
    codeValue?: string;
    ast?: Module | null;
    layerTree?: { hierarchical: HierarchicalTreeNode[]; flat: Record<string, FlatTreeNode> };
    spanMap?: Map<number, string>;
    parentSpanMap?: Map<number, number>;
    extension?: string;
    parsedAt?: number | null;
    viewportWidth?: number;
    export?: "named" | "default" | "namespace" | null;
    properties?: Properties | null;
    params?: Record<string, FormattedParam> | null;
    history?: FileHistory | null;
    sandpackPath?: string;
    sandpackCode?: string;
  }
) => {
  const store = getStoreByProjectId(projectId);
  const now = Date.now();

  setState(store, (state) => {
    const existingFile = state.files[id];
    const file =
      existingFile ||
      ({
        id,
        name: updates.name || "",
        slug: updates.slug || "",
        lastEdit: updates.lastEdit ?? null,
        parsedAt: updates.parsedAt ?? now,
        projectId,
        path: updates.path || "",
        extension: updates.extension || "tsx",
        code: updates.code || { reference: "", augmented: "", stateless: "", preview: "" },
        ast: null,
        layerTree: { hierarchical: [], flat: {} },
        spanMap: new Map(),
        parentSpanMap: new Map(),
        history: getDefaultHistory(updates.code?.reference || ""),
        viewportWidth: undefined,
      } as FileManagerItem);

    if (updates.name !== undefined) file.name = updates.name;
    if (updates.slug !== undefined) file.slug = updates.slug;
    if (updates.lastEdit !== undefined) file.lastEdit = updates.lastEdit;
    if (updates.path !== undefined) file.path = updates.path;
    if (updates.extension !== undefined) file.extension = updates.extension;
    if (updates.parsedAt !== undefined) file.parsedAt = updates.parsedAt;
    if (updates.viewportWidth !== undefined) file.viewportWidth = updates.viewportWidth;
    if (updates.ast !== undefined) file.ast = updates.ast;
    if (updates.layerTree !== undefined) file.layerTree = updates.layerTree;
    if (updates.spanMap !== undefined) file.spanMap = updates.spanMap;
    if (updates.parentSpanMap !== undefined) file.parentSpanMap = updates.parentSpanMap;
    if (updates.history !== undefined && updates.history !== null) file.history = updates.history;
    if (updates.export !== undefined && updates.export !== null) file.export = updates.export;
    if (updates.properties !== undefined && updates.properties !== null) file.properties = updates.properties;
    if (updates.params !== undefined && updates.params !== null) file.params = updates.params;

    if (updates.code !== undefined) {
      file.code = updates.code;
    } else if (updates.codeType && updates.codeValue !== undefined) {
      file.code[updates.codeType] = updates.codeValue;
    }

    state.files[id] = file;

    if (updates.sandpackPath !== undefined && updates.sandpackCode !== undefined) {
      state.sandpackFiles[updates.sandpackPath] = updates.sandpackCode;
      state.lastChangedSandpackFile = {
        path: updates.sandpackPath,
        timestamp: Date.now(),
      };
    }
  });
};

// File management functions
export const addFile = (
  id: Id<"files">,
  name: string,
  slug: string,
  lastEdit: string | null,
  projectId: Id<"projects">,
  path: string,
  code: { reference: string; augmented: string; stateless: string; preview: string } = {
    reference: "",
    augmented: "",
    stateless: "",
    preview: "",
  },
  ast?: Module | null,
  layerTree: { hierarchical: HierarchicalTreeNode[]; flat: Record<string, FlatTreeNode> } = {
    hierarchical: [],
    flat: {},
  },
  spanMap: Map<number, string> = new Map(),
  parentSpanMap: Map<number, number> = new Map(),
  extension: string = "tsx",
  history?: FileHistory,
  parsedAt?: number | null,
  viewportWidth?: number
) => {
  updateFileStore(id, projectId, {
    name,
    slug,
    lastEdit,
    path,
    code,
    ast,
    layerTree,
    spanMap,
    parentSpanMap,
    extension,
    history: history ?? undefined,
    parsedAt,
    viewportWidth,
  });
};

export const removeFile = (id: Id<"files">, projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    if (!state.files[id]) return;
    delete state.files[id];
  });
};

export const getFile = (id: Id<"files">, projectId: Id<"projects">): FileManagerItem | undefined => {
  const store = getStoreByProjectId(projectId);
  return store.getState().files[id];
};

export const getAllFiles = (projectId: Id<"projects">): FileManagerItem[] => {
  const store = getStoreByProjectId(projectId);
  return Object.values(store.getState().files);
};

export const updateFileName = (id: Id<"files">, newName: string, projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.name = newName;
    file.slug = toSlug(newName);
  });
};

export const updateFilePath = (id: Id<"files">, newPath: string, projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.path = newPath;
  });
};

export const updateFileViewportWidth = (
  id: Id<"files">,
  viewportWidth: number | undefined,
  projectId: Id<"projects">
) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.viewportWidth = viewportWidth;
  });
};

export const updateFileCode = (
  id: Id<"files">,
  codeType: "reference" | "preview" | "augmented" | "stateless",
  code: string,
  projectId: Id<"projects">
) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.code[codeType] = code;
  });
};

export const updateAllFileCode = (
  id: Id<"files">,
  code: { reference: string; augmented: string; stateless: string; preview: string },
  projectId: Id<"projects">
) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.code = code;
  });
};

export const getFileCode = (
  id: Id<"files">,
  codeType: "reference" | "augmented" | "stateless" | "preview",
  projectId: Id<"projects">
): string => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[id];
  return file?.code[codeType] ?? "";
};

// AST management functions
export const updateFileAST = (id: Id<"files">, ast: Module | null, projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.ast = ast;
  });
};

export const getFileAST = async (id: Id<"files">, projectId: Id<"projects">): Promise<Module | null> => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[id];

  if (!file) return null;

  // If AST exists, clone it to avoid immer immutability issues
  if (file.ast) {
    return createTransformedAST(file.ast);
  }

  // If AST is missing, regenerate it from code
  if (file.code?.reference) {
    try {
      const ast = await convertToAST(file.code.reference);
      // Update the store with the regenerated AST
      updateFileAST(id, ast, projectId);
      return ast;
    } catch (error) {
      console.error(`Failed to regenerate AST for file ${id}:`, error);
      return null;
    }
  }

  return null;
};

// Export type management functions
export const updateFileExportType = (
  id: Id<"files">,
  exportType: "named" | "default" | "namespace",
  projectId: Id<"projects">
) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.export = exportType;
  });
};

export const getFileExportType = (
  id: Id<"files">,
  projectId: Id<"projects">
): "named" | "default" | "namespace" | undefined => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[id];
  return file?.export;
};

// Properties management functions
export const updateFileProperties = (id: Id<"files">, properties: Properties, projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.properties = properties;
  });
};

export const getFileProperties = (id: Id<"files">, projectId: Id<"projects">): Properties | undefined => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[id];
  return file?.properties;
};

// Params management functions
export const updateFileParams = (
  id: Id<"files">,
  params: Record<string, FormattedParam>,
  projectId: Id<"projects">
) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.params = params;
  });
};

export const getFileParams = (
  id: Id<"files">,
  projectId: Id<"projects">
): Record<string, FormattedParam> | undefined => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[id];
  return file?.params;
};

// Tree management functions
export const updateFileLayerTree = (
  id: Id<"files">,
  layerTree: { hierarchical: HierarchicalTreeNode[]; flat: Record<string, FlatTreeNode> },
  projectId: Id<"projects">,
  spanMap?: Map<number, string>
) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.layerTree = layerTree;
    if (spanMap !== undefined) file.spanMap = spanMap;
  });
};

export const getFileLayerTree = (id: Id<"files">, projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[id];
  return file?.layerTree ?? { hierarchical: [], flat: {} };
};

export const updateFileSpanMap = (id: Id<"files">, spanMap: Map<number, string>, projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.spanMap = spanMap;
  });
};

const ensureMap = <K, V>(
  value: Map<K, V> | Record<string, V> | undefined | null,
  defaultValue: Map<K, V> = new Map()
): Map<K, V> => {
  if (!value) return defaultValue;
  if (value instanceof Map) return value;
  return new Map(Object.entries(value).map(([k, v]) => [Number(k) as K, v]));
};

export const getFileSpanMap = (id: Id<"files">, projectId: Id<"projects">): Map<number, string> => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[id];
  return ensureMap(file?.spanMap);
};

export const getFileParentSpanMap = (id: Id<"files">, projectId: Id<"projects">): Map<number, number> => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[id];
  return ensureMap(file?.parentSpanMap);
};

// History management functions
export const updateFileHistory = (id: Id<"files">, history: FileHistory, projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.history = history;
  });
};

export const getFileHistory = (id: Id<"files">, projectId: Id<"projects">): FileHistory | undefined => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[id];
  return file?.history;
};

// Batched update function for file content
export const updateFileContent = (
  id: Id<"files">,
  projectId: Id<"projects">,
  content: Partial<{
    ast: Module | null;
    export: "named" | "default" | "namespace" | null;
    properties: Properties | null;
    params: Record<string, FormattedParam> | null;
    layerTree: { hierarchical: HierarchicalTreeNode[]; flat: Record<string, FlatTreeNode> } | null;
    spanMap: Map<number, string> | null;
    parentSpanMap: Map<number, number> | null;
    history: FileHistory | null;
  }>
) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;

    if (content.ast !== undefined) file.ast = content.ast;
    if (content.export !== undefined && content.export !== null) file.export = content.export;
    if (content.properties !== undefined && content.properties !== null) file.properties = content.properties;
    if (content.params !== undefined && content.params !== null) file.params = content.params;
    if (content.layerTree !== undefined && content.layerTree !== null) file.layerTree = content.layerTree;
    if (content.spanMap !== undefined && content.spanMap !== null) file.spanMap = content.spanMap;
    if (content.parentSpanMap !== undefined && content.parentSpanMap !== null)
      file.parentSpanMap = content.parentSpanMap;
    if (content.history !== undefined && content.history !== null) file.history = content.history;
  });
};

// Sandpack files management functions
export const updateSandpackFiles = (sandpackFiles: Record<string, string>, projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  const paths = Object.keys(sandpackFiles);

  setState(store, (state) => {
    Object.assign(state.sandpackFiles, sandpackFiles);
    state.lastChangedSandpackFile =
      paths.length === 1 ? { path: paths[0], timestamp: Date.now() } : state.lastChangedSandpackFile;
  });
};

export const getSandpackFiles = (projectId: Id<"projects">): Record<string, string> => {
  const store = getStoreByProjectId(projectId);
  return store.getState().sandpackFiles;
};

export const updateSandpackFile = (path: string, code: string, projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    state.sandpackFiles[path] = code;
    state.lastChangedSandpackFile = {
      path,
      timestamp: Date.now(),
    };
  });
};

export const removeSandpackFile = (path: string, projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    delete state.sandpackFiles[path];
  });
};

export const useLastChangedSandpackFile = (projectId: Id<"projects">) => {
  return useFileManagerStore((state) => state.lastChangedSandpackFile, projectId);
};

export const getLastChangedSandpackFile = (
  projectId: Id<"projects">
): { path: string; timestamp: number } | undefined => {
  const store = getStoreByProjectId(projectId);
  return store.getState().lastChangedSandpackFile;
};

// Reset function for a specific instance
export const resetFileManager = (projectId: Id<"projects">) => {
  const store = getStoreByProjectId(projectId);
  store.setState(getInitialState(projectId));
};

// Destroy a specific instance
export const destroyFileManagerInstance = (projectId: Id<"projects">) => {
  const id = generateIdFromString(projectId);
  instances.delete(id);
};

// Get all active instances
export const getAllFileManagerInstances = (): string[] => {
  return Array.from(instances.values()).map((store) => store.getState().projectId);
};

// Destroy all instances
export const destroyAllFileManagerInstances = () => {
  instances.clear();
};

// Class suggestions management functions
export const getFileClassSuggestions = (id: Id<"files">, nodeId: string, projectId: Id<"projects">): string[] => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[id];
  return file?.classSuggestions?.[nodeId] || [];
};

export const setFileClassSuggestions = (
  id: Id<"files">,
  nodeId: string,
  suggestions: string[],
  projectId: Id<"projects">
): void => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    if (!file.classSuggestions) {
      file.classSuggestions = {};
    }
    file.classSuggestions[nodeId] = suggestions;
  });
};

export const removeFileClassSuggestions = (id: Id<"files">, nodeId: string, projectId: Id<"projects">): void => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file || !file.classSuggestions) return;
    delete file.classSuggestions[nodeId];
  });
};

export const clearFileClassSuggestions = (id: Id<"files">, projectId: Id<"projects">): void => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[id];
    if (!file) return;
    file.classSuggestions = {};
  });
};

// Chat history management functions
export const createFileChatThread = (
  fileId: Id<"files">,
  projectId: Id<"projects">,
  title: string = "New Thread"
): string => {
  const store = getStoreByProjectId(projectId);
  const threadId = `thread-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const now = Date.now();

  setState(store, (state) => {
    const file = state.files[fileId];
    if (!file) return;

    const existingThreads = file.chatHistory || [];

    let threadsToKeep = existingThreads;
    if (existingThreads.length >= 5) {
      const sorted = [...existingThreads].sort((a, b) => a.createdAt - b.createdAt);
      threadsToKeep = sorted.slice(1);
    }

    const newThread: ChatHistory = {
      threadId,
      title,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    if (!file.chatHistory) {
      file.chatHistory = [];
    }
    file.chatHistory = [...threadsToKeep, newThread];
  });

  return threadId;
};

export const getFileChatThreads = (fileId: Id<"files">, projectId: Id<"projects">): ChatHistory[] => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[fileId];
  const threads = file?.chatHistory || [];
  return threads.sort((a, b) => b.updatedAt - a.updatedAt);
};

export const getFileChatThread = (
  fileId: Id<"files">,
  threadId: string,
  projectId: Id<"projects">
): ChatHistory | undefined => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[fileId];
  return file?.chatHistory?.find((t) => t.threadId === threadId);
};

export const updateFileChatThread = (
  fileId: Id<"files">,
  threadId: string,
  updates: Partial<ChatHistory>,
  projectId: Id<"projects">
): void => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[fileId];
    if (!file || !file.chatHistory) return;

    const thread = file.chatHistory.find((t) => t.threadId === threadId);
    if (thread) {
      Object.assign(thread, updates);
      thread.updatedAt = Date.now();
    }
  });
};

export const appendToFileChatThread = (
  fileId: Id<"files">,
  threadId: string,
  message: UIMessage,
  projectId: Id<"projects">
): void => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[fileId];
    if (!file || !file.chatHistory) return;

    const thread = file.chatHistory.find((t) => t.threadId === threadId);
    if (thread) {
      thread.messages.push(message);
      thread.updatedAt = Date.now();
    }
  });
};

export const deleteFileChatThread = (fileId: Id<"files">, threadId: string, projectId: Id<"projects">): void => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[fileId];
    if (!file || !file.chatHistory) return;

    file.chatHistory = file.chatHistory.filter((thread) => thread.threadId !== threadId);
  });
};

export const getRecentChatHistory = (
  fileId: Id<"files">,
  threadId: string,
  projectId: Id<"projects">,
  limit: number = 5
): UIMessage[] => {
  const thread = getFileChatThread(fileId, threadId, projectId);
  if (!thread) return [];
  return thread.messages.slice(-limit);
};

// Active thread management functions
export const getActiveThreadId = (fileId: Id<"files">, projectId: Id<"projects">): string | null => {
  const store = getStoreByProjectId(projectId);
  const file = store.getState().files[fileId];
  return file?.activeThreadId || null;
};

export const setActiveThreadId = (fileId: Id<"files">, threadId: string | null, projectId: Id<"projects">): void => {
  const store = getStoreByProjectId(projectId);
  setState(store, (state) => {
    const file = state.files[fileId];
    if (!file) return;
    file.activeThreadId = threadId || undefined;
  });
};
