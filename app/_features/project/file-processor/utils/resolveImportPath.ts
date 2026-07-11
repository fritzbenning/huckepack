import type { FileManagerItem } from "@project/file-manager/types";
import { resolvePath } from "./resolvePath";

export interface FilePathInfo {
  path: string;
}

export function resolveImportPath(
  importPath: string,
  currentFile: FilePathInfo,
  filesByPath: Map<string, FileManagerItem>
): string | null {
  let absolutePath: string;

  if (importPath.startsWith("@/")) {
    absolutePath = importPath.replace("@/", "/");
  } else if (importPath.startsWith("/")) {
    absolutePath = importPath;
  } else {
    absolutePath = resolvePath(currentFile.path || "", importPath);
  }

  const extensions = [".tsx", ".ts", ".jsx", ".js", ""];
  const indexFiles = ["/index.tsx", "/index.ts", "/index.jsx", "/index.js"];

  for (const ext of extensions) {
    const pathWithExt = absolutePath + ext;
    const matchedFile = filesByPath.get(pathWithExt);
    if (matchedFile) {
      return matchedFile.id;
    }
  }

  for (const indexFile of indexFiles) {
    const indexPath = absolutePath + indexFile;
    const matchedFile = filesByPath.get(indexPath);
    if (matchedFile) {
      return matchedFile.id;
    }
  }

  console.warn(`Could not resolve import: ${importPath} from ${currentFile.path}`);
  return null;
}
