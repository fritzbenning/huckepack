import { getExpressionSpan } from "@ast/core/get/getExpressionSpan";
import { isConditionalExpression, isStringLiteral, isTemplateLiteral } from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type { ConditionalExpression, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { findConditionalExpressionBySpanStart } from "../../utils/findExpression";
import { createStringLiteralWithClass } from "../../utils/stringLiteral";

export function addClass(
  ast: Module,
  conditionalSpanStart: number,
  className: string,
  alternateSpanStart?: number
): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  simple(transformedAst, {
    TemplateLiteral(node) {
      if (found || !isTemplateLiteral(node)) return;

      const result = findConditionalExpressionBySpanStart(node, conditionalSpanStart);
      if (!result) return;

      const { expression, span: exprSpan } = result;

      if (!isConditionalExpression(expression)) return;

      const conditionalExpr = expression as ConditionalExpression;
      const alternateSpan = getExpressionSpan(conditionalExpr.alternate);

      // Secondary validation: if alternateSpanStart provided, verify it matches
      if (alternateSpanStart !== undefined && alternateSpanStart !== 0) {
        if (!alternateSpan || alternateSpan.start !== alternateSpanStart) {
          return; // Skip if alternate span doesn't match
        }
      }

      if (!isStringLiteral(conditionalExpr.alternate)) {
        console.error("Alternate must be a string literal");
        return;
      }

      conditionalExpr.alternate = createStringLiteralWithClass(conditionalExpr.alternate.value, className);

      if (exprSpan) {
        conditionalExpr.span = {
          ...conditionalExpr.span,
          end: exprSpan.end + className.length + 1, // Approximate new end
        };
      }

      found = true;
    },
  });

  if (!found) {
    console.error(
      `Conditional alternate branch not found at conditional span start ${conditionalSpanStart}${
        alternateSpanStart !== undefined ? ` (alternate span start ${alternateSpanStart})` : ""
      }`
    );
  }

  return transformedAst;
}
