import { getSpan } from "@ast/core/get/getSpan";
import type { Expression, UnaryExpression } from "@swc/wasm-web";

export function createUnaryExpression(
  argument: Expression,
  operator: "!" | "-" | "+" | "~" | "typeof" | "void" | "delete",
  originalStart: number,
  originalEnd: number
): UnaryExpression {
  const argSpan = getSpan(argument);
  const argLength = argSpan ? argSpan.end - argSpan.start : 0;
  const operatorLength = operator.length;
  const totalLength = operatorLength + argLength;

  const newEnd = Math.max(originalEnd, originalStart + totalLength);

  return {
    type: "UnaryExpression",
    span: {
      start: originalStart,
      end: newEnd,
      ctxt: 0,
    },
    operator,
    argument,
  };
}
