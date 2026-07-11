import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ApplicationStore {
  tooltipMode: boolean;
  enableTooltipMode: () => void;
  disableTooltipMode: () => void;
  explorerAsideWidth: number;
  inspectorAsideWidth: number;
  setExplorerAsideWidth: (width: number | ((prev: number) => number)) => void;
  setInspectorAsideWidth: (width: number | ((prev: number) => number)) => void;
}

const DEFAULT_EXPLORER_WIDTH = 296;
const DEFAULT_INSPECTOR_WIDTH = 296;

export const useApplicationStore = create<ApplicationStore>()(
  devtools(
    (set) => ({
      tooltipMode: false,
      enableTooltipMode: () => set({ tooltipMode: true }),
      disableTooltipMode: () => set({ tooltipMode: false }),
      explorerAsideWidth: DEFAULT_EXPLORER_WIDTH,
      inspectorAsideWidth: DEFAULT_INSPECTOR_WIDTH,
      setExplorerAsideWidth: (width) =>
        set((state) => ({
          explorerAsideWidth: typeof width === "function" ? width(state.explorerAsideWidth) : width,
        })),
      setInspectorAsideWidth: (width) =>
        set((state) => ({
          inspectorAsideWidth: typeof width === "function" ? width(state.inspectorAsideWidth) : width,
        })),
    }),
    { name: "ApplicationStore" }
  )
);

