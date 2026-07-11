import type { Id } from "@convex/_generated/dataModel";
import { getFilesMap } from "@project/file-manager";
import { type FilePathInfo, resolveImportPath } from "./resolveImportPath";

export function resolveFileDependencies(
  relativePaths: string[],
  currentFile: FilePathInfo,
  projectId: Id<"projects">
): string[] {
  const filesByPath = getFilesMap(projectId);

  const resolvedFileIds: string[] = [];

  for (const relativePath of relativePaths) {
    const fileId = resolveImportPath(relativePath, currentFile, filesByPath);
    if (fileId) {
      resolvedFileIds.push(fileId);
    }
  }

  return resolvedFileIds;
}
