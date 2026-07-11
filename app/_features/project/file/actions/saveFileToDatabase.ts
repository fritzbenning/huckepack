import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { computeReverseDiff } from "@editor/history/utils/diff";
import { convex } from "@lib/convex";
import type { getFileHistory } from "@project/file-manager";

export type CodeMutation = {
  fileId: Id<"files">;
  code: string;
  skipHistory: boolean;
  projectId: Id<"projects">;
  prevCode: string;
  history: ReturnType<typeof getFileHistory> | undefined;
  updatedAt: number;
  userId: Id<"users"> | null;
};

export const saveFileToDatabase = async (pending: CodeMutation) => {
  const { fileId, code, skipHistory, prevCode, history, updatedAt } = pending;

  try {
    // Compute diff before mutations to avoid blocking
    const reverseDiff = !skipHistory && prevCode !== code ? computeReverseDiff(code, prevCode) : null;
    const currentDiffCount = history?.diffCount ?? 0;
    const newDiffCount = reverseDiff ? currentDiffCount + 1 : currentDiffCount;
    const needsVersionSnapshot = newDiffCount >= 100;

    // Run file update and history operations in parallel
    const mutations: Promise<void>[] = [
      convex
        .mutation(
          api.files.update,
          {
            id: fileId,
            code,
            updatedAt,
          },
          {
            optimisticUpdate: (localStore) => {
              const existingFile = localStore.getQuery(api.files.get, { fileId });

              if (existingFile !== undefined && existingFile !== null) {
                localStore.setQuery(api.files.get, { fileId }, { ...existingFile, code, updatedAt });
              }
            },
          }
        )
        .catch((error) => {
          console.error(`[saveFileCode] Error saving to database:`, error);
        })
        .then(() => undefined),
    ];

    if (!skipHistory && reverseDiff) {
      if (needsVersionSnapshot) {
        mutations.push(
          convex
            .mutation(api.files.createVersionSnapshot, {
              fileId,
              code,
            })
            .catch((error) => {
              console.error(`[saveFileCode] Error creating version snapshot:`, error);
            })
            .then(() => undefined)
        );
      }
      // mutations.push(
      //   convex
      //     .mutation(api.files.addHistoryEntry, {
      //       fileId,
      //       diff: reverseDiff,
      //       historyPointer: history?.historyPointer,
      //     })
      //     .catch((error) => {
      //       console.error(`[saveFileCode] Error adding history entry:`, error);
      //     })
      //     .then(() => undefined)
      // );
    }

    await Promise.all(mutations);
  } catch (error) {
    console.error(`[saveFileCode] Error executing mutation for file ${fileId}:`, error);
  }
};
