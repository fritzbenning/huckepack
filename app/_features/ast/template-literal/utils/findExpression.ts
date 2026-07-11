import { getExpressionSpan } from "@ast/core/get/getExpressionSpan";
import type { Expression, TemplateLiteral } from "@swc/wasm-web";

/**
 * Finds an expression in a template literal by its span start.
 */
export function findExpressionBySpanStart(
  node: TemplateLiteral,
  spanStart: number
): { expression: Expression; index: number; span: { start: number; end: number } } | null {
  for (let i = 0; i < node.expressions.length; i++) {
    const expr = node.expressions[i];
    const exprSpan = getExpressionSpan(expr);
    if (exprSpan && exprSpan.start === spanStart) {
      return { expression: expr, index: i, span: exprSpan };
    }
  }
  return null;
}

/**
 * Finds an expression in a template literal by conditional span start (for conditional expressions).
 */
export function findConditionalExpressionBySpanStart(
  node: TemplateLiteral,
  conditionalSpanStart: number
): { expression: Expression; index: number; span: { start: number; end: number } } | null {
  for (let i = 0; i < node.expressions.length; i++) {
    const expr = node.expressions[i];
    const exprSpan = getExpressionSpan(expr);
    if (exprSpan && exprSpan.start === conditionalSpanStart) {
      return { expression: expr, index: i, span: exprSpan };
    }
  }
  return null;
}

