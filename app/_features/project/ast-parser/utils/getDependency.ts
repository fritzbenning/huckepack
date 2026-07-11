import type { ImportDeclaration } from "@swc/wasm-web";
import type { ExternalDependency } from "../types";

export function getDependency(importDecl: ImportDeclaration): ExternalDependency | null {
  const source = importDecl.source.value;

  // Skip internal imports
  const isExternal = !source.startsWith(".") && !source.startsWith("/") && !source.startsWith("@/");
  if (!isExternal) return null;

  // Extract package name (handle scoped packages like @heroicons/react)
  const packageName = source.startsWith("@") ? source.split("/").slice(0, 2).join("/") : source.split("/")[0];

  let importType: ExternalDependency["importType"] = "side-effect";
  const importedNames: string[] = [];

  // Process import specifiers
  if (importDecl.specifiers && importDecl.specifiers.length > 0) {
    for (const specifier of importDecl.specifiers) {
      switch (specifier.type) {
        case "ImportDefaultSpecifier":
          importType = "default";
          importedNames.push(specifier.local.value);
          break;
        case "ImportNamespaceSpecifier":
          importType = "namespace";
          importedNames.push(specifier.local.value);
          break;
        case "ImportSpecifier":
          importType = "named";
          if (specifier.imported) {
            const importedName = specifier.imported.type === "Identifier" ? specifier.imported.value : specifier.imported.value;
            importedNames.push(importedName);
          }
          break;
      }
    }
  }

  return {
    name: packageName,
    importType,
    importedNames,
  };
}
