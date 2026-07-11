import { createTransformedAST } from "@ast/utils";
import type { ImportDeclaration, Module } from "@swc/wasm-web";

export function removeImport(ast: Module, importToRemove: ImportDeclaration): Module {
  const transformedAst = createTransformedAST(ast);
  const sourceToRemove = importToRemove.source.value;

  // Find and remove the import
  for (let i = 0; i < transformedAst.body.length; i++) {
    const item = transformedAst.body[i];
    if (item.type === "ImportDeclaration") {
      const importDecl = item as ImportDeclaration;
      if (importDecl.source.value === sourceToRemove) {
        // Check if this import has the same specifiers
        const hasMatchingSpecifiers = importDecl.specifiers.some((spec) => {
          if (spec.type === "ImportDefaultSpecifier") {
            return importToRemove.specifiers.some(
              (s) => s.type === "ImportDefaultSpecifier" && s.local.value === spec.local.value
            );
          } else if (spec.type === "ImportSpecifier") {
            return importToRemove.specifiers.some(
              (s) =>
                s.type === "ImportSpecifier" &&
                s.local.value === spec.local.value &&
                (!spec.imported || !s.imported || spec.imported.value === s.imported.value)
            );
          } else if (spec.type === "ImportNamespaceSpecifier") {
            return importToRemove.specifiers.some(
              (s) => s.type === "ImportNamespaceSpecifier" && s.local.value === spec.local.value
            );
          }
          return false;
        });

        if (hasMatchingSpecifiers) {
          transformedAst.body.splice(i, 1);
          break;
        }
      }
    }
  }

  return transformedAst;
}
