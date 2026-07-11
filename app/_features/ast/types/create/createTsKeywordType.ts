import { createSpan } from "@ast/core/create/createSpan";
import type { TsKeywordType } from "@swc/wasm-web";

export function createTsKeywordType(kind: "any" | "unknown" | "number" | "string" | "boolean" | "void" | "null" | "undefined"): TsKeywordType {
  return {
    type: "TsKeywordType",
    span: createSpan(kind.length),
    kind,
  } as TsKeywordType;
}

