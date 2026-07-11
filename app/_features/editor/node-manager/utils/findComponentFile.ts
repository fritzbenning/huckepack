import { getAllFiles } from "@project/file-manager";
import type { FileManagerItem } from "@project/file-manager/types";

export function findComponentFile(
  componentName: string,
  projectId: string,
  excludeFileId: string
): FileManagerItem | undefined {
  const allFiles = getAllFiles(projectId);
  return allFiles.find(
    (file) => file.name.replace(/\.(tsx?|jsx?)$/, "") === componentName && file.id !== excludeFileId && file.export
  );
}
