import { createSpan } from "@ast/core/create/createSpan";
import type { NumericLiteral } from "@swc/wasm-web";

export function createNumericLiteral(value: number): NumericLiteral {
  const raw = String(value);
  return {
    type: "NumericLiteral",
    span: createSpan(raw.length),
    value,
    raw,
  };
}
