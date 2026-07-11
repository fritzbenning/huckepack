import { transformASTOrNull } from "@ast/utils";
import type { Module, TsInterfaceDeclaration, TsPropertySignature } from "@swc/wasm-web";

// Updates the optionality of a property in a TypeScript interface
export function updateInterfacePropertyOptionality(
  ast: Module,
  propertyName: string,
  optional: boolean
): Module | null {
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
          ((member as TsPropertySignature).key as { value: string }).value === propertyName
      ) as TsPropertySignature | undefined;

      if (property) {
        property.optional = optional;
        return true;
      }
      return false;
    },
  });
}
