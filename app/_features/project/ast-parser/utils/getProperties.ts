import { isIdentifier, isTsPropertySignature } from "@ast/type-check";
import type { TsInterfaceDeclaration } from "@swc/wasm-web";
import type { Properties } from "../types";
import { getPropertyType } from "./getPropertyType";

export function getProperties(interfaceDecl: TsInterfaceDeclaration): Properties {
  const properties: Properties = {};

  if (!interfaceDecl.body?.body) {
    return properties;
  }

  for (const member of interfaceDecl.body.body) {
    if (!isTsPropertySignature(member)) continue;

    const prop = member;
    if (!prop.key || !isIdentifier(prop.key)) continue;

    const name = prop.key.value;
    const typeAnnotation = prop.typeAnnotation?.typeAnnotation;
    const type = typeAnnotation ? getPropertyType(typeAnnotation) : { kind: "any", rawKind: "unknown", value: null };

    properties[name] = {
      type,
      optional: prop.optional || false,
    };
  }

  return properties;
}
