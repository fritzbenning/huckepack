import { createSpan } from "@ast/core/create/createSpan";
import type { BooleanLiteral } from "@swc/wasm-web";

export function createBooleanLiteral(value: boolean): BooleanLiteral {
  const raw = value ? "true" : "false";
  return {
    type: "BooleanLiteral",
    span: createSpan(raw.length),
    value,
  };
}
