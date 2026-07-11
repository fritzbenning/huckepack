import { useApplicationStore } from "@application/stores/applicationStore";
import { useCallback, useMemo } from "react";
import { MAX_WIDTH_PX, MIN_WIDTH_PX } from "./constants";

interface PanelSizes {
  left: number;
  middle: number;
  right: number;
  minSize: number;
  maxSize: number;
}

interface UseResizePanelsReturn {
  panelSizes: PanelSizes;
  handleLeftPanelResize: (size: number) => void;
  handleRightPanelResize: (size: number) => void;
}

export const useResizePanels = (): UseResizePanelsReturn => {
  const explorerAsideWidth = useApplicationStore((state) => state.explorerAsideWidth);
  const inspectorAsideWidth = useApplicationStore((state) => state.inspectorAsideWidth);
  const setExplorerAsideWidth = useApplicationStore((state) => state.setExplorerAsideWidth);
  const setInspectorAsideWidth = useApplicationStore((state) => state.setInspectorAsideWidth);

  const calculatePanelSizes = useCallback((): PanelSizes => {
    if (typeof window === "undefined") {
      return { left: 20, middle: 60, right: 20, minSize: 10, maxSize: 30 };
    }

    const totalWidth = window.innerWidth;
    const leftPercent = (explorerAsideWidth / totalWidth) * 100;
    const rightPercent = (inspectorAsideWidth / totalWidth) * 100;
    const middlePercent = 100 - leftPercent - rightPercent;
    const minSizePercent = (MIN_WIDTH_PX / totalWidth) * 100;
    const maxSizePercent = (MAX_WIDTH_PX / totalWidth) * 100;

    return {
      left: Math.max(minSizePercent, Math.min(maxSizePercent, leftPercent)),
      middle: Math.max(40, middlePercent),
      right: Math.max(minSizePercent, Math.min(maxSizePercent, rightPercent)),
      minSize: minSizePercent,
      maxSize: maxSizePercent,
    };
  }, [explorerAsideWidth, inspectorAsideWidth]);

  const panelSizes = useMemo(() => calculatePanelSizes(), [calculatePanelSizes]);

  const handleLeftPanelResize = useCallback(
    (size: number) => {
      if (typeof window === "undefined") return;
      const totalWidth = window.innerWidth;
      const newWidth = (size / 100) * totalWidth;
      const clampedWidth = Math.max(MIN_WIDTH_PX, Math.min(MAX_WIDTH_PX, newWidth));
      setExplorerAsideWidth(clampedWidth);
    },
    [setExplorerAsideWidth]
  );

  const handleRightPanelResize = useCallback(
    (size: number) => {
      if (typeof window === "undefined") return;
      const totalWidth = window.innerWidth;
      const newWidth = (size / 100) * totalWidth;
      const clampedWidth = Math.max(MIN_WIDTH_PX, Math.min(MAX_WIDTH_PX, newWidth));
      setInspectorAsideWidth(clampedWidth);
    },
    [setInspectorAsideWidth]
  );

  return {
    panelSizes,
    handleLeftPanelResize,
    handleRightPanelResize,
  };
};
