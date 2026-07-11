import { transformASTOrNull } from "@ast/utils";
import type { Module, TsInterfaceDeclaration, TsPropertySignature } from "@swc/wasm-web";

// Renames a property in a TypeScript interface
export function renameInterfaceProperty(ast: Module, oldPropertyName: string, newPropertyName: string): Module | null {
  return transformASTOrNull(ast, {
    TsInterfaceDeclaration(node: unknown) {
      const interfaceDecl = node as TsInterfaceDeclaration;

      if (!interfaceDecl.body?.body) {
        return false;
      }

      const property = interfaceDecl.body.body.find(
        (member) =>
          member.type === "TsPropertySignature" &&
          (member as TsPropertySignature).key?.type === "Identifier" &&
          ((member as TsPropertySignature).key as { value: string }).value === oldPropertyName
      ) as TsPropertySignature | undefined;

      if (property?.key && property.key.type === "Identifier") {
        property.key.value = newPropertyName;
        return true;
      }
      return false;
    },
  });
}

