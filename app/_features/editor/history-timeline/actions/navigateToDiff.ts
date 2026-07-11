import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { FileHistory } from "@editor/history/types";
import { reconstructPreviousVersion } from "@editor/history/utils/diff";
import { convex } from "@lib/convex";
import { saveFileCode } from "@project/file/actions/saveFileCode";
import { getFile, updateFileCode, updateSandpackFile } from "@project/file-manager";

export async function navigateToDiff(
  fileId: Id<"files">,
  projectId: Id<"projects">,
  history: FileHistory,
  targetPointer: number
): Promise<void> {
  if (targetPointer < 0 || targetPointer >= history.history.length) {
    console.warn("[navigateToDiff] Invalid target pointer", {
      targetPointer,
      historyLength: history.history.length,
    });
    return;
  }

  if (targetPointer === history.historyPointer) {
    return;
  }

  const fileData = await convex.query(api.files.get, {
    fileId,
  });

  if (!fileData) {
    throw new Error("File not found");
  }

  await convex.mutation(api.files.updateHistoryPointer, {
    fileId,
    historyPointer: targetPointer,
  });

  const reverseDiffs = history.history.map((entry) => entry.diff);
  const stepsBack = history.history.length - 1 - targetPointer;

  let reconstructedCode: string;
  try {
    reconstructedCode = reconstructPreviousVersion(fileData.code, reverseDiffs, stepsBack);
  } catch (error) {
    console.error("[navigateToDiff] Failed to reconstruct code", error);
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
