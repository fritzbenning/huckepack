import { createTransformedAST } from "@ast/utils";
import type { ImportDeclaration, Module } from "@swc/wasm-web";

export function removeImportByName(ast: Module, componentName: string, sourcePath: string): Module {
  const transformedAst = createTransformedAST(ast);

  for (let i = 0; i < transformedAst.body.length; i++) {
    const item = transformedAst.body[i];
    if (item.type === "ImportDeclaration") {
      const importDecl = item as ImportDeclaration;
      if (importDecl.source.value === sourcePath) {
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
          // If this import only has one specifier and it's our component, remove the entire import
          if (importDecl.specifiers.length === 1) {
            transformedAst.body.splice(i, 1);
          } else {
            // Remove just this specifier
            const specIndex = importDecl.specifiers.findIndex((spec) => {
              if (spec.type === "ImportDefaultSpecifier") {
                return spec.local.value === componentName;
              } else if (spec.type === "ImportSpecifier") {
                const importedName = spec.imported?.value || spec.local.value;
                return importedName === componentName || spec.local.value === componentName;
              }
              return false;
            });
            if (specIndex !== -1) {
              importDecl.specifiers.splice(specIndex, 1);
            }
          }
          break;
        }
      }
    }
  }

  return transformedAst;
}
