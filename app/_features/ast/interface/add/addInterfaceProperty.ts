import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createInterface } from "@ast/interface/create/createInterface";
import { createTsType, createTsUnionType } from "@ast/types/create/createTsType";
import { transformAST } from "@ast/utils";
import type { Module, TsInterfaceDeclaration, TsPropertySignature } from "@swc/wasm-web";

// Adds a property to a TypeScript interface
export function addInterfaceProperty(
  ast: Module,
  propertyName: string,
  propertyType: string,
  unionOptions?: (string | number | boolean)[],
  optional = false,
  fileName?: string
): Module | null {
  let interfaceCount = 0;

  const { ast: transformedAst, found } = transformAST(ast, {
    TsInterfaceDeclaration(node: unknown) {
      interfaceCount++;
      const interfaceDecl = node as TsInterfaceDeclaration;

      if (!interfaceDecl.body?.body) {
        return false;
      }

      const existingProp = interfaceDecl.body.body.find(
        (member) =>
          member.type === "TsPropertySignature" &&
          (member as TsPropertySignature).key?.type === "Identifier" &&
          ((member as TsPropertySignature).key as { value: string }).value === propertyName
      );

      if (existingProp) {
        return false;
      }

      const tsType =
        unionOptions && unionOptions.length > 0
          ? createTsUnionType(unionOptions.map(String))
          : createTsType(propertyType);

      const newProperty: TsPropertySignature = {
        type: "TsPropertySignature",
        key: createIdentifier(propertyName),
        computed: false,
        optional,
        typeAnnotation: {
          type: "TsTypeAnnotation",
          span: createSpan(),
          typeAnnotation: tsType,
        },
        readonly: false,
        span: createSpan(),
      };

      interfaceDecl.body.body.push(newProperty as unknown as (typeof interfaceDecl.body.body)[0]);
      return true;
    },
  });

  if (!found && interfaceCount === 0 && fileName) {
    const astWithInterface = createInterface(
      transformedAst,
      fileName,
      propertyName,
      propertyType,
      unionOptions,
      optional
    );
    return astWithInterface;
  }

  return found ? transformedAst : null;
}
