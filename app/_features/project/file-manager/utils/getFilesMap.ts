import type { Id } from "@convex/_generated/dataModel";
import type { FileManagerItem } from "../types";
import { getFileManagerStore } from "../stores/fileManagerStore";

export function getFilesMap(projectId: Id<"projects">): Map<string, FileManagerItem> {
  const store = getFileManagerStore(projectId);
  const files = store.getState().files;
  const filesByPath = new Map<string, FileManagerItem>();
  
  for (const fileId in files) {
    const file = files[fileId];
    if (file?.path) {
      filesByPath.set(file.path, file);
    }
  }
  
  return filesByPath;
}

