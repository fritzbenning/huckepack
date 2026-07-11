import { transformASTOrNull } from "@ast/utils";
import type { Module, TsInterfaceDeclaration, TsPropertySignature } from "@swc/wasm-web";

// Removes a property from a TypeScript interface
export function removeInterfaceProperty(ast: Module, propertyName: string): Module | null {
  return transformASTOrNull(ast, {
    TsInterfaceDeclaration(node: unknown) {
      const interfaceDecl = node as TsInterfaceDeclaration;

      if (!interfaceDecl.body?.body) {
        return false;
      }

      const index = interfaceDecl.body.body.findIndex(
        (member) =>
          member.type === "TsPropertySignature" &&
          (member as TsPropertySignature).key?.type === "Identifier" &&
          ((member as TsPropertySignature).key as { value: string }).value === propertyName
      );

      if (index !== -1) {
        interfaceDecl.body.body.splice(index, 1);
        return true;
      }
      return false;
    },
  });
}

