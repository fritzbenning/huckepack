import type { ImportDeclaration, Module } from "@swc/wasm-web";

export function findImport(ast: Module, componentName: string, sourcePath: string): ImportDeclaration | null {
  for (const item of ast.body) {
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
          return importDecl;
        }
      }
    }
  }

  return null;
}
