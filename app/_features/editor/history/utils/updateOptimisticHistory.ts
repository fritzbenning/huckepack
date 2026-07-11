import type { Id } from "@convex/_generated/dataModel";
import { updateFileHistory } from "@project/file-manager";
import type { FileHistory } from "../types";

export function updateOptimisticHistory(params: {
  history: FileHistory;
  reverseDiff: string;
  code: string;
  newDiffCount: number;
  fileId: Id<"files">;
  projectId: Id<"projects">;
  userId: Id<"users"> | null;
}): void {
  const { history, reverseDiff, code, newDiffCount, fileId, projectId, userId } = params;

  const currentHistory = history.history ?? [];
  const currentPointer = history.historyPointer ?? 0;
  const newHistoryEntry = {
    diff: reverseDiff,
    timestamp: Date.now(),
    userId: userId ?? ("" as Id<"users">),
  };

  const newHistoryArray = [...currentHistory.slice(0, currentPointer + 1), newHistoryEntry];
  const trimmedHistory = newHistoryArray.length > 100 ? newHistoryArray.slice(-100) : newHistoryArray;
  const newPointer = trimmedHistory.length - 1;

  const optimisticHistory: FileHistory = {
    history: trimmedHistory,
    historyPointer: newPointer,
    currentCode: code,
    diffCount: newDiffCount,
    versions: history.versions ?? [],
  };

  updateFileHistory(fileId, optimisticHistory, projectId);
}
