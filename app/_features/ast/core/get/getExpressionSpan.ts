import { getSpan } from "@ast/core/get/getSpan";
import type { Expression } from "@swc/wasm-web";

export function getExpressionSpan(expr: Expression): { start: number; end: number } | null {
  const span = getSpan(expr);
  if (span.start === 0 && span.end === 0 && span.ctxt === 0) {
    // getSpan returns default when span is not found
    return null;
  }
  return span;
}
