import type { FileVersion, HistoryEntry } from "@editor/history/types";

export type TimelineItemType = "diff" | "version";

export interface TimelineDiffItem extends HistoryEntry {
  type: "diff";
  index: number;
}

export interface TimelineVersionItem extends FileVersion {
  type: "version";
}

export type TimelineItem = TimelineDiffItem | TimelineVersionItem;

export interface TimelineData {
  items: TimelineItem[];
  currentHistoryPointer: number;
  currentCode: string;
}
