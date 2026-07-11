import { removeImportByName } from "@ast/import/remove/removeImportByName";
import { getComponentName } from "@ast/import/utils/getComponentName";
import { isComponentUsedElsewhere } from "@ast/import/utils/isComponentUsedElsewhere";
import type { JSXElement, Module } from "@swc/wasm-web";
import { findImportPathForComponent } from "./findComponentFileFromImport";

export function removeUnusedComponentImport(ast: Module, deletedElement: JSXElement): Module {
  const componentName = getComponentName(deletedElement);
  if (!componentName) {
    return ast;
  }

  // Check if component is still used elsewhere
  const stillUsed = isComponentUsedElsewhere(ast, componentName);
  if (stillUsed) {
    return ast;
  }

  // Find the import path directly from the import statement
  const importPath = findImportPathForComponent(ast, componentName);
  if (!importPath) {
    return ast;
  }

  // Remove the import using the path from the import statement
  return removeImportByName(ast, componentName, importPath);
}
