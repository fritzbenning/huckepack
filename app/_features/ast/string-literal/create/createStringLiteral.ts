import { createSpan } from "@ast/core/create/createSpan";
import type { StringLiteral } from "@swc/wasm-web";

/**
 * Creates a StringLiteral AST node
 */
export function createStringLiteral(value: string): StringLiteral {
  const raw = `"${value}"`;
  return {
    type: "StringLiteral",
    span: createSpan(raw.length),
    value,
    raw,
  };
}
