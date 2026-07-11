import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { CanvasState, FileCanvasState } from "../types";

interface CanvasStore {
  canvases: Record<string, CanvasState>;
}

const initialFileCanvasState: FileCanvasState = {
  selectedNode: null,
};

const initialCanvasState: Omit<CanvasState, "projectId"> = {
  zoom: 1,
  breakpoint: { viewport: "stretch", width: "100%" },
  inspectorWidth: "w-74",
  showCodeEditor: false,
  focusMode: false,
  activeTool: "edit-tool",
  viewportHeight: 800,
  files: {},
};

const initialState: CanvasStore = {
  canvases: {},
};

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    persist(
      () => ({
        ...initialState,
      }),
      {
        name: "canvas-store",
        partialize: (state) => ({
          canvases: Object.fromEntries(
            Object.entries(state.canvases).map(([projectId, canvas]) => [
              projectId,
              {
                ...canvas,
                files: Object.fromEntries(
                  Object.entries(canvas.files).map(([fileId, fileCanvas]) => [
                    fileId,
                    {
                      ...fileCanvas,
                      selectedNode: null, // Always reset selectedNode to initial value
                    },
                  ])
                ),
              },
            ])
          ),
        }),
      }
    )
  )
);

// Initialize a canvas for a project
export const addCanvas = (projectId: string) => {
  useCanvasStore.setState((state) => {
    if (state.canvases[projectId]) {
      return state;
    }

    return {
      canvases: {
        ...state.canvases,
        [projectId]: { projectId, ...initialCanvasState },
      },
    };
  });
};

// Remove a canvas for a project
export const removeCanvas = (projectId: string) => {
  useCanvasStore.setState((state) => {
    const { [projectId]: _, ...remainingCanvases } = state.canvases;
    return { canvases: remainingCanvases };
  });
};

// Get all canvases
export const getAllCanvases = (): Record<string, CanvasState> => {
  return useCanvasStore.getState().canvases;
};

// Get canvas state for a specific project
export const getCanvas = (projectId: string): CanvasState | undefined => {
  return useCanvasStore.getState().canvases[projectId];
};

// Check if a canvas exists for a project
export const hasCanvas = (projectId: string): boolean => {
  return !!useCanvasStore.getState().canvases[projectId];
};

// Clear all canvases
export const clearCanvases = () => {
  useCanvasStore.setState({ canvases: {} });
};

// Canvas state management functions
export const setZoom = (projectId: string, zoom: number) => {
  useCanvasStore.setState((state) => {
    const canvas = state.canvases[projectId];
    if (!canvas) return state;

    return {
      canvases: {
        ...state.canvases,
        [projectId]: { ...canvas, zoom },
      },
    };
  });
};

export const resetZoom = (projectId: string) => {
  setZoom(projectId, 1);
};

export const setBreakpoint = (
  projectId: string,
  viewport: "mobile" | "desktop" | "stretch" | "custom" | "auto",
  width: number | "100%" | "auto" | null = null
) => {
  useCanvasStore.setState((state) => {
    const canvas = state.canvases[projectId];
    if (!canvas) return state;

    const breakpointWidth =
      width !== null
        ? width
        : viewport === "mobile"
          ? 375
          : viewport === "desktop"
            ? 1280
            : viewport === "auto"
              ? "auto"
              : "100%";

    return {
      canvases: {
        ...state.canvases,
        [projectId]: {
          ...canvas,
          breakpoint: { viewport, width: breakpointWidth },
        },
      },
    };
  });
};

export const setInspectorWidth = (projectId: string, width: string) => {
  useCanvasStore.setState((state) => {
    const canvas = state.canvases[projectId];
    if (!canvas) return state;

    return {
      canvases: {
        ...state.canvases,
        [projectId]: { ...canvas, inspectorWidth: width },
      },
    };
  });
};

export const setShowCodeEditor = (projectId: string, show: boolean) => {
  useCanvasStore.setState((state) => {
    const canvas = state.canvases[projectId];
    if (!canvas) return state;

    return {
      canvases: {
        ...state.canvases,
        [projectId]: { ...canvas, showCodeEditor: show },
      },
    };
  });
};

export const toggleCodeEditor = (projectId: string) => {
  useCanvasStore.setState((state) => {
    const canvas = state.canvases[projectId];
    if (!canvas) return state;

    return {
      canvases: {
        ...state.canvases,
        [projectId]: { ...canvas, showCodeEditor: !canvas.showCodeEditor },
      },
    };
  });
};

export const setFocusMode = (projectId: string, focus: boolean) => {
  useCanvasStore.setState((state) => {
    const canvas = state.canvases[projectId];
    if (!canvas) return state;

    return {
      canvases: {
        ...state.canvases,
        [projectId]: { ...canvas, focusMode: focus },
      },
    };
  });
};

export const toggleFocusMode = (projectId: string) => {
  useCanvasStore.setState((state) => {
    const canvas = state.canvases[projectId];
    if (!canvas) return state;

    return {
      canvases: {
        ...state.canvases,
        [projectId]: { ...canvas, focusMode: !canvas.focusMode },
      },
    };
  });
};

export const setActiveTool = (projectId: string, tool: string) => {
  useCanvasStore.setState((state) => {
    const canvas = state.canvases[projectId];
    if (!canvas) return state;

    return {
      canvases: {
        ...state.canvases,
        [projectId]: { ...canvas, activeTool: tool },
      },
    };
  });
};

export const getZoom = (projectId: string): number => {
  const canvas = useCanvasStore.getState().canvases[projectId];
  return canvas?.zoom ?? initialCanvasState.zoom;
};

export const getBreakpoint = (projectId: string) => {
  const canvas = useCanvasStore.getState().canvases[projectId];
  return canvas?.breakpoint ?? initialCanvasState.breakpoint;
};

export const getInspectorWidth = (projectId: string): string => {
  const canvas = useCanvasStore.getState().canvases[projectId];
  return canvas?.inspectorWidth ?? initialCanvasState.inspectorWidth;
};

export const getShowCodeEditor = (projectId: string): boolean => {
  const canvas = useCanvasStore.getState().canvases[projectId];
  return canvas?.showCodeEditor ?? initialCanvasState.showCodeEditor;
};

export const getFocusMode = (projectId: string): boolean => {
  const canvas = useCanvasStore.getState().canvases[projectId];
  return canvas?.focusMode ?? initialCanvasState.focusMode;
};

export const getActiveTool = (projectId: string): string => {
  const canvas = useCanvasStore.getState().canvases[projectId];
  return canvas?.activeTool ?? initialCanvasState.activeTool;
};

// File-level state management
export const addFileCanvas = (projectId: string, fileId: string) => {
  useCanvasStore.setState((state) => {
    const canvas = state.canvases[projectId];

    // If project doesn't exist, create it with file
    if (!canvas) {
      return {
        canvases: {
          ...state.canvases,
          [projectId]: {
            projectId,
            ...initialCanvasState,
            files: { [fileId]: { ...initialFileCanvasState } },
          },
        },
      };
    }

    // If file already exists, return unchanged
    if (canvas.files[fileId]) {
      return state;
    }

    // Add file to existing project
    return {
      canvases: {
        ...state.canvases,
        [projectId]: {
          ...canvas,
          files: {
            ...canvas.files,
            [fileId]: { ...initialFileCanvasState },
          },
        },
      },
    };
  });
};

export const removeFileCanvas = (projectId: string, fileId: string) => {
  useCanvasStore.setState((state) => {
    const canvas = state.canvases[projectId];
    if (!canvas) return state;

    const { [fileId]: _, ...remainingFiles } = canvas.files;
    return {
      canvases: {
        ...state.canvases,
        [projectId]: {
          ...canvas,
          files: remainingFiles,
        },
      },
    };
  });
};

export const getFileCanvas = (projectId: string, fileId: string): FileCanvasState | undefined => {
  return useCanvasStore.getState().canvases[projectId]?.files[fileId];
};

export const hasFileCanvas = (projectId: string, fileId: string): boolean => {
  return !!useCanvasStore.getState().canvases[projectId]?.files[fileId];
};

// Selected Tree Node management
export const setSelectedNode = (projectId: string, fileId: string, selectedNode: string | null) => {
  useCanvasStore.setState((state) => {
    const canvas = state.canvases[projectId];

    if (!canvas) {
      // Create project and file state if they don't exist
      return {
        canvases: {
          ...state.canvases,
          [projectId]: {
            projectId,
            ...initialCanvasState,
            files: {
              [fileId]: { ...initialFileCanvasState, selectedNode },
            },
          },
        },
      };
    }

    const fileCanvas = canvas.files[fileId];
    if (!fileCanvas) {
      // Create file state if it doesn't exist
      return {
        canvases: {
          ...state.canvases,
          [projectId]: {
            ...canvas,
            files: {
              ...canvas.files,
              [fileId]: { ...initialFileCanvasState, selectedNode },
            },
          },
        },
      };
    }

    // Update existing file state
    return {
      canvases: {
        ...state.canvases,
        [projectId]: {
          ...canvas,
          files: {
            ...canvas.files,
            [fileId]: { ...fileCanvas, selectedNode },
          },
        },
      },
    };
  });
};

export const getSelectedNode = (projectId: string, fileId: string): string | null => {
  const fileCanvas = useCanvasStore.getState().canvases[projectId]?.files[fileId];
  return fileCanvas?.selectedNode ?? initialFileCanvasState.selectedNode;
};
