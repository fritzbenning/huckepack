import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { FileHistory } from "@editor/history/types";
import { reconstructPreviousVersion } from "@editor/history/utils/diff";
import { convex } from "@lib/convex";

export async function createVersionFromDiff(
  fileId: Id<"files">,
  history: FileHistory,
  selectedDiffIndex: number | null
): Promise<void> {
  const fileData = await convex.query(api.files.get, {
    fileId,
  });

  if (!fileData) {
    throw new Error("File not found");
  }

  const reverseDiffs = history.history.map((entry) => entry.diff);
  let codeToSnapshot: string;

  if (selectedDiffIndex !== null && selectedDiffIndex >= 0 && selectedDiffIndex < history.history.length) {
    const stepsBack = history.history.length - 1 - selectedDiffIndex;
    try {
      codeToSnapshot = reconstructPreviousVersion(fileData.code, reverseDiffs, stepsBack);
    } catch (error) {
      console.error("[createVersionFromDiff] Failed to reconstruct code from diff", error);
      throw error;
    }
  } else {
    const latestIndex = history.history.length - 1;
    if (latestIndex >= 0) {
      const stepsBack = history.history.length - 1 - latestIndex;
      try {
        codeToSnapshot = reconstructPreviousVersion(fileData.code, reverseDiffs, stepsBack);
      } catch (error) {
        console.error("[createVersionFromDiff] Failed to reconstruct latest code", error);
        throw error;
      }
    } else {
      codeToSnapshot = fileData.code;
    }
  }

  await convex.mutation(api.files.createVersionSnapshot, {
    fileId,
    code: codeToSnapshot,
  });
}
