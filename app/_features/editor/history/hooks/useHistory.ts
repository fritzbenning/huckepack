import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useCallback, useMemo, useState } from "react";
import { reconstructCodeFromHistory } from "../utils/reconstructCodeFromHistory";

export function useHistory(fileId: string | undefined) {
  const [localPointer, setLocalPointer] = useState<number | null>(null);

  const history = useQuery(api.files.getHistory, fileId ? { fileId: fileId as Id<"files"> } : "skip");

  const currentHistory = useMemo(() => {
    if (!history) return null;
    const pointer = localPointer !== null ? localPointer : history.historyPointer;
    return {
      ...history,
      historyPointer: pointer,
    };
  }, [history, localPointer]);

  const currentCode = useMemo(() => {
    if (!currentHistory) return null;
    try {
      return reconstructCodeFromHistory(currentHistory);
    } catch (error) {
      console.error("[useHistory] Failed to reconstruct code from history", error);
      return null;
    }
  }, [currentHistory]);

  const canUndo = useMemo(() => {
    if (!currentHistory) return false;
    return currentHistory.historyPointer > 0;
  }, [currentHistory]);

  const canRedo = useMemo(() => {
    if (!currentHistory) return false;
    return currentHistory.historyPointer < currentHistory.history.length - 1;
  }, [currentHistory]);

  const undo = useCallback(async () => {
    if (!currentHistory || !fileId || !canUndo) return null;

    const newPointer = currentHistory.historyPointer - 1;
    setLocalPointer(newPointer);

    const newCode = reconstructCodeFromHistory({
      ...currentHistory,
      historyPointer: newPointer,
    });

    return newCode;
  }, [currentHistory, fileId, canUndo]);

  const redo = useCallback(async () => {
    if (!currentHistory || !fileId || !canRedo) return null;

    const newPointer = currentHistory.historyPointer + 1;
    setLocalPointer(newPointer);

    const newCode = reconstructCodeFromHistory({
      ...currentHistory,
      historyPointer: newPointer,
    });

    return newCode;
  }, [currentHistory, fileId, canRedo]);

  const resetLocalPointer = useCallback(() => {
    setLocalPointer(null);
  }, []);

  return {
    history: currentHistory,
    currentCode,
    canUndo,
    canRedo,
    undo,
    redo,
    resetLocalPointer,
  };
}
