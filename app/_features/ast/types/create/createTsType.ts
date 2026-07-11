import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type { TsType, TsTypeReference, TsUnionType } from "@swc/wasm-web";
import { createTsKeywordType } from "./createTsKeywordType";

export type PropertyTypeKind = "string" | "number" | "boolean" | "any" | "unknown" | "void" | "null" | "undefined";

export function createTsType(kind: PropertyTypeKind | string): TsType {
  // Handle keyword types
  if (["string", "number", "boolean", "any", "unknown", "void", "null", "undefined"].includes(kind)) {
    return createTsKeywordType(kind as PropertyTypeKind) as TsType;
  }

  // Handle type references (e.g., "React.ReactNode", "HTMLElement")
  return {
    type: "TsTypeReference",
    span: createSpan(kind.length),
    typeName: createIdentifier(kind),
  } as TsTypeReference as TsType;
}

export function createTsUnionType(types: string[]): TsUnionType {
  return {
    type: "TsUnionType",
    span: createSpan(0),
    types: types.map((t) => createTsType(t)),
  } as TsUnionType;
}
