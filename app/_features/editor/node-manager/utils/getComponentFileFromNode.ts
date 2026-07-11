import { getComponentName } from "@ast/import/utils/getComponentName";
import { getAllFiles, getFile } from "@project/file-manager/stores/fileManagerStore";
import type { JSXElement, Module } from "@swc/wasm-web";
import { findImportPathForComponent } from "./findComponentFileFromImport";
import { isComponentElement } from "./isComponentElement";

export function getComponentFileFromNode(
  element: JSXElement,
  ast: Module,
  projectId: string,
  _currentFileId: string,
  currentFilePath: string
): { fileId: string; fileName: string } | null {
  if (!isComponentElement(element)) {
    return null;
  }

  const componentName = getComponentName(element);
  if (!componentName) {
    return null;
  }

  const importPath = findImportPathForComponent(ast, componentName);
  if (!importPath) {
    return null;
  }

  const allFiles = getAllFiles(projectId);
  const resolvedFileId = resolveImportPath(importPath, currentFilePath, allFiles);
  if (!resolvedFileId) {
    return null;
  }

  const componentFile = getFile(resolvedFileId, projectId);
  if (!componentFile) {
    return null;
  }

  return {
    fileId: componentFile.id,
    fileName: componentFile.name,
  };
}

function resolveImportPath(
  importPath: string,
  currentFilePath: string,
  allFiles: ReturnType<typeof getAllFiles>
): string | null {
  let absolutePath: string;

  if (importPath.startsWith("@/")) {
    absolutePath = importPath.replace("@/", "/");
  } else if (importPath.startsWith("/")) {
    absolutePath = importPath;
  } else {
    const baseSegments = currentFilePath.split("/").filter(Boolean);
    const relativeSegments = importPath.split("/").filter(Boolean);
    const result = baseSegments.slice(0, -1);

    for (const segment of relativeSegments) {
      if (segment === "..") {
        result.pop();
      } else if (segment !== ".") {
        result.push(segment);
      }
    }

    absolutePath = `/${result.join("/")}`;
  }

  const extensions = [".tsx", ".ts", ".jsx", ".js", ""];
  const indexFiles = ["/index.tsx", "/index.ts", "/index.jsx", "/index.js"];

  for (const ext of extensions) {
    const pathWithExt = absolutePath + ext;
    const matchedFile = allFiles.find((f) => {
      const filePath = f.path || "";
      return filePath === pathWithExt;
    });

    if (matchedFile) {
      return matchedFile.id;
    }
  }

  for (const indexFile of indexFiles) {
    const indexPath = absolutePath + indexFile;
    const matchedFile = allFiles.find((f) => {
      const filePath = f.path || "";
      return filePath === indexPath;
    });

    if (matchedFile) {
      return matchedFile.id;
    }
  }

  return null;
}
