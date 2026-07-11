import type { FileHistory } from "../types";
import { reconstructPreviousVersion } from "./diff";

export function reconstructCodeFromHistory(history: FileHistory): string {
  const reverseDiffs = history.history.map((entry) => entry.diff);
  const stepsBack = history.history.length - 1 - history.historyPointer;
  return reconstructPreviousVersion(history.currentCode, reverseDiffs, stepsBack);
}

