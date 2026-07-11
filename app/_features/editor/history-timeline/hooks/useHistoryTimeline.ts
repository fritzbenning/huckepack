import type { Id } from "@convex/_generated/dataModel";
import type { FileVersion, HistoryEntry } from "@editor/history/types";
import { useStoreFile } from "@project/file-manager";
import { useMemo, useState } from "react";
import type { TimelineData, TimelineDiffItem, TimelineItem, TimelineVersionItem } from "../types";

export function useHistoryTimeline(fileId: Id<"files"> | undefined, projectId: Id<"projects">) {
  const { file } = useStoreFile(fileId, projectId);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const timelineData = useMemo((): TimelineData | null => {
    if (!file?.history || !fileId) {
      return null;
    }

    const { history: fileHistory } = file;

    const diffItems: TimelineDiffItem[] = fileHistory.history.map((entry: HistoryEntry, index: number) => ({
      ...entry,
      type: "diff" as const,
      index,
    }));

    const versionItems: TimelineVersionItem[] = (fileHistory.versions || []).map((version: FileVersion) => ({
      ...version,
      type: "version" as const,
    }));

    const allItems: TimelineItem[] = [...diffItems, ...versionItems].sort((a, b) => {
      const timestampA = a.type === "diff" ? a.timestamp : a.createdAt;
      const timestampB = b.type === "diff" ? b.timestamp : b.createdAt;
      if (timestampA !== timestampB) {
        return timestampA - timestampB;
      }
      return a.type === "version" ? 1 : -1;
    });

    return {
      items: allItems,
      currentHistoryPointer: fileHistory.historyPointer,
      currentCode: fileHistory.currentCode,
    };
  }, [file?.history, fileId]);

  const selectedItem = useMemo(() => {
    if (selectedIndex === null || !timelineData) {
      return null;
    }
    return timelineData.items[selectedIndex] ?? null;
  }, [selectedIndex, timelineData]);

  const selectedDiffIndex = useMemo(() => {
    if (!selectedItem || selectedItem.type !== "diff") {
      return null;
    }
    return selectedItem.index;
  }, [selectedItem]);

  const hoveredItem = useMemo(() => {
    if (hoveredIndex === null || !timelineData) {
      return null;
    }
    return timelineData.items[hoveredIndex] ?? null;
  }, [hoveredIndex, timelineData]);

  const displayItem = useMemo(() => {
    if (hoveredItem) {
      return hoveredItem;
    }
    if (selectedItem) {
      return selectedItem;
    }
    if (!timelineData || timelineData.items.length === 0) {
      return null;
    }
    return timelineData.items[timelineData.items.length - 1];
  }, [hoveredItem, selectedItem, timelineData]);

  const handleItemSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const clearSelection = () => {
    setSelectedIndex(null);
  };

  const handleItemHover = (index: number | null) => {
    setHoveredIndex(index);
  };

  return {
    timelineData,
    history: file?.history ?? null,
    selectedItem,
    selectedDiffIndex,
    displayItem,
    selectedIndex,
    handleItemSelect,
    clearSelection,
    handleItemHover,
  };
}
