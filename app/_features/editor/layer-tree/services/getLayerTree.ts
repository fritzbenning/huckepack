import { getComponentName } from "@ast/import/utils/getComponentName";
import { getNestedJSXElements } from "@ast/jsx";
import type { Id } from "@convex/_generated/dataModel";
import { findImportPathForComponent } from "@editor/node-manager/utils/findComponentFileFromImport";
import { getJSXAttributes } from "@editor/node-manager/utils/getJSXAttributes";
import { getAllFiles, getFile } from "@project/file-manager";
import type { JSXElement, Module } from "@swc/wasm-web";
import type { ComponentInstance, ComponentProp, HierarchicalTreeNode } from "../types";
import { createTreeNode } from "./createTreeNode";

function resolveImportPath(
  importPath: string,
  currentFilePath: string,
  allFiles: ReturnType<typeof getAllFiles>
): string | null {
  // Resolve the absolute path
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

export const getLayerTree = (
  node: JSXElement,
  siblingIndex = 0,
  parentId = "",
  code?: string,
  depth = 0,
  ast?: Module,
  projectId?: string,
  currentFileId?: string,
  currentFilePath?: string
): HierarchicalTreeNode => {
  // Resolve component instance info if this is a component
  let component: ComponentInstance | undefined;

  if (ast && projectId && currentFileId && currentFilePath) {
    const componentName = getComponentName(node);
    if (componentName) {
      const importPath = findImportPathForComponent(ast, componentName);
      if (importPath) {
        const allFiles = getAllFiles(projectId as Id<"projects">);
        const resolvedFileId = resolveImportPath(importPath, currentFilePath, allFiles);
        if (resolvedFileId) {
          const componentFile = getFile(resolvedFileId as Id<"files">, projectId as Id<"projects">);
          if (componentFile) {
            const currentProps = getJSXAttributes(node.opening, node);
            const properties = componentFile.properties || {};
            const params = componentFile.params || {};

            const props: Record<string, ComponentProp> = {};
            for (const propName of Object.keys(properties)) {
              const property = properties[propName];
              const param = params[propName];
              props[propName] = {
                type: property.type,
                optional: property.optional,
                defaultValue: param?.defaultValue ?? null,
                currentValue: currentProps[propName] ?? null,
              };
            }

            component = {
              fileId: componentFile.id,
              fileName: componentFile.name,
              props,
            };
          }
        }
      }
    }
  }

  const { id, info } = createTreeNode(node, siblingIndex, parentId, depth, code, component, ast);

  const getNestedTreeNodes = (
    node: JSXElement,
    currentDepth: number,
    currentParentId: string
  ): HierarchicalTreeNode[] => {
    let siblingIndex = 0;
    const treeNodes: HierarchicalTreeNode[] = [];

    for (const child of node.children) {
      const extracted = getNestedJSXElements(child);
      for (const jsxElement of extracted) {
        // Resolve component instance info for nested components too
        let nestedComponent: ComponentInstance | undefined;

        if (ast && projectId && currentFileId && currentFilePath) {
          const nestedComponentName = getComponentName(jsxElement);
          if (nestedComponentName) {
            const importPath = findImportPathForComponent(ast, nestedComponentName);
            if (importPath) {
              const allFiles = getAllFiles(projectId as Id<"projects">);
              const resolvedFileId = resolveImportPath(importPath, currentFilePath, allFiles);
              if (resolvedFileId) {
                const componentFile = getFile(resolvedFileId as Id<"files">, projectId as Id<"projects">);
                if (componentFile) {
                  // Extract current props from this JSX element instance
                  // Pass the element to getJSXAttributes so it can read children from JSX children
                  const currentProps = getJSXAttributes(jsxElement.opening, jsxElement);
                  const properties = componentFile.properties || {};
                  const params = componentFile.params || {};

                  // Consolidate properties, params, and currentProps into a single props object
                  const props: Record<string, ComponentProp> = {};
                  for (const propName of Object.keys(properties)) {
                    const property = properties[propName];
                    const param = params[propName];
                    props[propName] = {
                      type: property.type,
                      optional: property.optional,
                      defaultValue: param?.defaultValue ?? null,
                      currentValue: currentProps[propName] ?? null,
                    };
                  }

                  nestedComponent = {
                    fileId: componentFile.id,
                    fileName: componentFile.name,
                    props,
                  };
                }
              }
            }
          }
        }

        const { id: childId, info: nestedTreeNode } = createTreeNode(
          jsxElement,
          siblingIndex++,
          currentParentId,
          currentDepth + 1,
          code,
          nestedComponent,
          ast
        );
        treeNodes.push({
          id: childId,
          info: nestedTreeNode,
          children: getNestedTreeNodes(jsxElement, currentDepth + 1, childId),
        });
      }
    }

    return treeNodes;
  };

  return {
    id,
    info,
    children: getNestedTreeNodes(node, depth, id),
  };
};
