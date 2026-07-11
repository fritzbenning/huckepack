import type { Id } from "@convex/_generated/dataModel";

export interface HistoryEntry {
  diff: string;
  timestamp: number;
  userId: Id<"users">;
}

export interface FileVersion {
  _id: Id<"fileVersions">;
  fileId: Id<"files">;
  version: number;
  code: string;
  extension?: string;
  createdAt: number;
  userId?: Id<"users">;
}

export interface FileHistory {
  history: HistoryEntry[];
  historyPointer: number;
  currentCode: string;
  diffCount: number;
  versions: FileVersion[];
}

