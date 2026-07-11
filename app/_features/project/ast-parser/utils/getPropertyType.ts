import { isTsUnionType } from "@ast/type-check";
import type { TsType } from "@swc/wasm-web";
import type { PropertyType } from "../types";
import { getTypeString } from "./getTypeString";

export function getPropertyType(typeAnnotation: TsType): PropertyType {
  const annotationType = typeAnnotation.type;

  // Handle union types
  if (isTsUnionType(typeAnnotation)) {
    return {
      kind: "union",
      rawKind: annotationType,
      unionOptions: typeAnnotation.types.map((type: TsType) => getTypeString(type)),
    };
  }
  // Handle all other types
  return {
    kind: getTypeString(typeAnnotation),
    rawKind: annotationType,
  };
}
