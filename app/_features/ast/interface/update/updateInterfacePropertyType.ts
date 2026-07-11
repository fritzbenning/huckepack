import { createTsType, createTsUnionType } from "@ast/types/create/createTsType";
import { transformASTOrNull } from "@ast/utils";
import type { Module, TsInterfaceDeclaration, TsPropertySignature } from "@swc/wasm-web";

// Updates the type of a property in a TypeScript interface
export function updateInterfacePropertyType(
  ast: Module,
  propertyName: string,
  newType: string,
  unionOptions?: (string | number | boolean)[]
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

      if (property?.typeAnnotation) {
        const tsType =
          unionOptions && unionOptions.length > 0 ? createTsUnionType(unionOptions.map(String)) : createTsType(newType);

        property.typeAnnotation.typeAnnotation = tsType;
        return true;
      }
      return false;
    },
  });
}
