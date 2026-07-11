import { calculatePerformanceTotal, setPerformanceMetrics, usePerformanceStore } from "@application/performance";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";
import { getFile, getFileHistory } from "@project/file-manager";
import { processAndStoreFile } from "@project/file-processor/services/processAndStoreFile";
import type { Module } from "@swc/wasm-web";
import { type CodeMutation, saveFileToDatabase } from "./saveFileToDatabase";

export const saveFileCode = async (params: {
  projectId: Id<"projects">;
  fileId: Id<"files">;
  code: string;
  skipHistory?: boolean;
  ast?: Module | null;
}): Promise<void> => {
  const { projectId, fileId, code, skipHistory = false, ast } = params;

  const localFile = getFile(fileId, projectId);

  if (!localFile) {
    throw new Error("Current file not found in file manager");
  }

  const prevCode = localFile.code.reference;

  const localHistory = getFileHistory(fileId, projectId);

  const timestamp = Date.now();

  const currentUser = await convex.query(api.users.current);
  const userId = (currentUser?._id ?? null) as Id<"users"> | null;

  const pending: CodeMutation = {
    fileId,
    code,
    skipHistory,
    projectId,
    prevCode,
    history: localHistory,
    updatedAt: timestamp,
    userId,
  };

  processAndStoreFile(
    localFile.id,
    localFile.name,
    code,
    projectId,
    localFile.lastEdit,
    null,
    localFile.extension,
    localFile.slug,
    timestamp,
    localFile.viewportWidth,
    ast
  ).catch((error) => {
    console.error(`[saveFileCode] Error processing file ${localFile.id}:`, error);
  });

  const updatedMetrics = usePerformanceStore.getState().metrics;
  setPerformanceMetrics({
    total: calculatePerformanceTotal(updatedMetrics),
  });

  const saveFileToDatabaseStart = performance.now();

  saveFileToDatabase(pending)
    .then(() => {
      const saveFileToDatabaseEnd = performance.now();
      const databaseSaveDuration = saveFileToDatabaseEnd - saveFileToDatabaseStart;
      const currentMetrics = usePerformanceStore.getState().metrics;
      setPerformanceMetrics({
        savingPhase: {
          astToCode: currentMetrics.savingPhase.astToCode,
          indexedDBSave: currentMetrics.savingPhase.indexedDBSave,
          sandpackUpdate: currentMetrics.savingPhase.sandpackUpdate,
          databaseSave: databaseSaveDuration,
        },
      });
    })
    .catch((error) => {
      const saveFileToDatabaseEnd = performance.now();
      const databaseSaveDuration = saveFileToDatabaseEnd - saveFileToDatabaseStart;
      const currentMetrics = usePerformanceStore.getState().metrics;
      setPerformanceMetrics({
        savingPhase: {
          astToCode: currentMetrics.savingPhase.astToCode,
          indexedDBSave: currentMetrics.savingPhase.indexedDBSave,
          sandpackUpdate: currentMetrics.savingPhase.sandpackUpdate,
          databaseSave: databaseSaveDuration,
        },
      });
      console.error(`[saveFileCode] Error executing mutation for file ${localFile.id}:`, error);
    });
};
