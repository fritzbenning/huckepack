import { getComponentName } from "@ast/import/utils/getComponentName";
import type { JSXElement, Module } from "@swc/wasm-web";
import { getAllFiles, getFile } from "@project/file-manager";
import type { FileManagerItem } from "@project/file-manager/types";

/**
 * Resolves an import path to a file ID
 */
function resolveImportPath(importPath: string, currentFilePath: string, allFiles: FileManagerItem[]): string | null {
  // Resolve the absolute path
  let absolutePath: string;

  if (importPath.startsWith("@/")) {
    // Absolute import from src root (e.g., "@/components/Button")
    absolutePath = importPath.replace("@/", "/");
  } else if (importPath.startsWith("/")) {
    // Absolute path
    absolutePath = importPath;
  } else {
    // Relative import (e.g., "./Button" or "../components/Icon")
    // Split paths into segments
    const baseSegments = currentFilePath.split("/").filter(Boolean);
    const relativeSegments = importPath.split("/").filter(Boolean);

    // Start with base directory (remove file name)
    const result = baseSegments.slice(0, -1);

    // Process relative path segments
    for (const segment of relativeSegments) {
      if (segment === "..") {
        result.pop(); // Go up one directory
      } else if (segment !== ".") {
        result.push(segment);
      }
    }

    absolutePath = "/" + result.join("/");
  }

  // Try to find matching file with various extensions
  const extensions = [".tsx", ".ts", ".jsx", ".js", ""];
  const indexFiles = ["/index.tsx", "/index.ts", "/index.jsx", "/index.js"];

  for (const ext of extensions) {
    const pathWithExt = absolutePath + ext;

    // Try exact match
    const matchedFile = allFiles.find((f) => {
      const filePath = f.path || "";
      return filePath === pathWithExt;
    });

    if (matchedFile) {
      return matchedFile.id;
    }
  }

  // Try index files (e.g., "./Button" might be "./Button/index.tsx")
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

/**
 * Finds the import path for a component by looking up the import statement in the AST.
 * Returns the import path (e.g., "./Button" or "../components/Icon") if found.
 */
export function findImportPathForComponent(
  ast: Module,
  componentName: string
): string | undefined {
  // Find the import statement that imports this component
  for (const item of ast.body) {
    if (item.type === "ImportDeclaration") {
      const importDecl = item;
      
      // Check if this import includes the component name
      const hasComponent = importDecl.specifiers.some((spec) => {
        if (spec.type === "ImportDefaultSpecifier") {
          return spec.local.value === componentName;
        } else if (spec.type === "ImportSpecifier") {
          const importedName = spec.imported?.value || spec.local.value;
          return importedName === componentName || spec.local.value === componentName;
        } else if (spec.type === "ImportNamespaceSpecifier") {
          return spec.local.value === componentName;
        }
        return false;
      });

      if (hasComponent) {
        // Found the import! Return the import path
        return importDecl.source.value;
      }
    }
  }

  return undefined;
}

/**
 * Finds the component file by looking up the import statement in the AST
 * instead of searching all files by name.
 */
export function findComponentFileFromImport(
  ast: Module,
  element: JSXElement,
  projectId: string,
  currentFileId: string
): FileManagerItem | undefined {
  const componentName = getComponentName(element);
  if (!componentName) {
    return undefined;
  }

  const currentFile = getFile(currentFileId, projectId);
  if (!currentFile) {
    return undefined;
  }

  const importPath = findImportPathForComponent(ast, componentName);
  if (!importPath) {
    return undefined;
  }

  const allFiles = getAllFiles(projectId);
  const componentFileId = resolveImportPath(importPath, currentFile.path, allFiles);
  
  if (componentFileId) {
    return getFile(componentFileId, projectId);
  }

  return undefined;
}

