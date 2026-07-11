import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { getDeclarationFromExport } from "@ast/parameter/utils/getDeclarationFromExport";
import { createTsType, createTsUnionType } from "@ast/types/create/createTsType";
import { createTransformedAST } from "@ast/utils";
import { toSlug } from "@shared/utils/format";
import type { Identifier, Module, ModuleItem, TsInterfaceDeclaration, TsPropertySignature } from "@swc/wasm-web";

// Converts fileName to a valid PascalCase identifier (slug)
function getFunctionName(fileName: string): string {
  return toSlug(fileName);
}

// Creates a new interface declaration
export function createInterface(
  ast: Module,
  fileName: string,
  propertyName: string,
  propertyType: string,
  unionOptions?: (string | number | boolean)[],
  optional = false
): Module | null {
  const transformedAst = createTransformedAST(ast);

  // Get function name (convert to slug/PascalCase)
  const functionName = getFunctionName(fileName);

  // Create interface name: {FunctionName}Props
  const interfaceName = `${functionName}Props`;

  // Create the type annotation
  const tsType =
    unionOptions && unionOptions.length > 0 ? createTsUnionType(unionOptions.map(String)) : createTsType(propertyType);

  // Create the property signature
  const propertySignature: TsPropertySignature = {
    type: "TsPropertySignature",
    key: createIdentifier(propertyName),
    computed: false,
    optional,
    typeAnnotation: {
      type: "TsTypeAnnotation",
      span: createSpan(propertyType.length),
      typeAnnotation: tsType,
    },
    readonly: false,
    span: createSpan(propertyName.length),
  };

  // Create the interface declaration
  const interfaceDecl: TsInterfaceDeclaration = {
    type: "TsInterfaceDeclaration",
    id: createIdentifier(interfaceName, 2),
    declare: false,
    typeParams: undefined,
    extends: [],
    body: {
      type: "TsInterfaceBody",
      span: createSpan(interfaceName.length),
      body: [propertySignature as unknown as typeof propertySignature],
    },
    span: createSpan(interfaceName.length),
  };

  // Find the position to insert the interface (before the function declaration)
  let insertIndex = -1;
  for (let i = 0; i < transformedAst.body.length; i++) {
    const item = transformedAst.body[i];

    // Check if this is an export declaration with our function
    const declaration = getDeclarationFromExport(item);
    if (declaration?.identifier) {
      const identifier = declaration.identifier as Identifier;
      if (identifier.value === functionName) {
        insertIndex = i;
        break;
      }
    }
  }

  // If we found the function, insert the interface before it
  // Otherwise, insert it at the beginning (after imports)
  if (insertIndex === -1) {
    // Find the last import declaration
    let lastImportIndex = -1;
    for (let i = 0; i < transformedAst.body.length; i++) {
      if (transformedAst.body[i].type === "ImportDeclaration") {
        lastImportIndex = i;
      }
    }
    insertIndex = lastImportIndex + 1;
  }

  // Insert the interface declaration
  transformedAst.body.splice(insertIndex, 0, interfaceDecl as unknown as ModuleItem);

  return transformedAst;
}
