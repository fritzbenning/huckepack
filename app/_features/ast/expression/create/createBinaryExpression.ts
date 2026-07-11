import { getSpan } from "@ast/core/get/getSpan";
import type { BinaryExpression, Expression } from "@swc/wasm-web";

export function createBinaryExpression(
  leftExpr: Expression,
  operator: string,
  rightExpr: Expression,
  originalStart: number,
  originalEnd: number
): BinaryExpression {
  const leftSpan = getSpan(leftExpr);
  const rightSpan = getSpan(rightExpr);

  const leftLength = leftSpan ? leftSpan.end - leftSpan.start : 0;
  const rightLength = rightSpan ? rightSpan.end - rightSpan.start : 0;
  const operatorLength = operator.length;
  const totalLength = leftLength + operatorLength + rightLength + 2;

  const newEnd = Math.max(originalEnd, originalStart + totalLength);

  return {
    type: "BinaryExpression",
    span: {
      start: originalStart,
      end: newEnd,
      ctxt: 0,
    },
    operator: operator as BinaryExpression["operator"],
    left: leftExpr,
    right: rightExpr,
  };
}
