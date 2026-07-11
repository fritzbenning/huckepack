import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";
import { saveFileCode } from "@project/file/actions/saveFileCode";
import { getFile, updateFileCode, updateSandpackFile } from "@project/file-manager";
import type { FileHistory } from "../types";
import { reconstructPreviousVersion } from "../utils/diff";

export async function undo(fileId: Id<"files">, projectId: Id<"projects">, history: FileHistory): Promise<void> {
  if (history.historyPointer <= 0) {
    return;
  }

  const fileData = await convex.query(api.files.get, {
    fileId,
  });

  if (!fileData) {
    throw new Error("File not found");
  }

  const newPointer = history.historyPointer - 1;

  await convex.mutation(api.files.updateHistoryPointer, {
    fileId,
    historyPointer: newPointer,
  });

  const reverseDiffs = history.history.map((entry) => entry.diff);
  const stepsBack = history.history.length - 1 - newPointer;

  let reconstructedCode: string;
  try {
    reconstructedCode = reconstructPreviousVersion(fileData.code, reverseDiffs, stepsBack);
  } catch (error) {
    console.error("[undo] Failed to reconstruct code", error);
    throw error;
  }

  const currentFile = getFile(fileId, projectId);
  if (currentFile) {
    updateFileCode(fileId, "reference", reconstructedCode, projectId);
    if (currentFile.path) {
      updateSandpackFile(currentFile.path, reconstructedCode, projectId);
    }
  }

  await saveFileCode({
    projectId,
    fileId,
    code: reconstructedCode,
    skipHistory: true,
  });
}

export async function redo(fileId: Id<"files">, projectId: Id<"projects">, history: FileHistory): Promise<void> {
  if (history.historyPointer >= history.history.length - 1) {
    return;
  }

  const fileData = await convex.query(api.files.get, {
    fileId,
  });

  if (!fileData) {
    throw new Error("File not found");
  }

  const newPointer = history.historyPointer + 1;

  await convex.mutation(api.files.updateHistoryPointer, {
    fileId,
    historyPointer: newPointer,
  });

  const reverseDiffs = history.history.map((entry) => entry.diff);
  const stepsBack = history.history.length - 1 - newPointer;

  let reconstructedCode: string;
  try {
    reconstructedCode = reconstructPreviousVersion(fileData.code, reverseDiffs, stepsBack);
  } catch (error) {
    console.error("[redo] Failed to reconstruct code", error);
    throw error;
  }

  const currentFile = getFile(fileId, projectId);
  if (currentFile) {
    updateFileCode(fileId, "reference", reconstructedCode, projectId);
    if (currentFile.path) {
      updateSandpackFile(currentFile.path, reconstructedCode, projectId);
    }
  }

  await saveFileCode({
    projectId,
    fileId,
    code: reconstructedCode,
    skipHistory: true,
  });
}
