import { getExpressionSpan } from "@ast/core/get/getExpressionSpan";
import { isBinaryExpression, isConditionalExpression, isStringLiteral, isTemplateLiteral } from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type { BinaryExpression, ConditionalExpression, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { createStringLiteralWithClass } from "../../utils/stringLiteral";

export function addClass(
  ast: Module,
  consequentSpanStart: number,
  className: string,
  conditionalSpanStart?: number
): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  simple(transformedAst, {
    TemplateLiteral(node) {
      if (found || !isTemplateLiteral(node)) return;

      for (let i = 0; i < node.expressions.length; i++) {
        const expr = node.expressions[i];
        const exprSpan = getExpressionSpan(expr);
        const exprSpanStart = exprSpan?.start;

        // Match by conditional expression span start if provided (more reliable), otherwise by consequent span start
        const matchesBySpan = conditionalSpanStart !== undefined && exprSpanStart === conditionalSpanStart;

        // Handle conditional expressions
        if (isConditionalExpression(expr)) {
          const conditionalExpr = expr as ConditionalExpression;
          const consequentSpan = getExpressionSpan(conditionalExpr.consequent);
          const matchesByConsequent =
            !matchesBySpan && consequentSpan?.start === consequentSpanStart && consequentSpanStart !== 0;

          if (matchesBySpan || matchesByConsequent) {
            if (!isStringLiteral(conditionalExpr.consequent)) return;

            conditionalExpr.consequent = createStringLiteralWithClass(conditionalExpr.consequent.value, className);

            if (exprSpan) {
              conditionalExpr.span = {
                ...conditionalExpr.span,
                end: exprSpan.end + className.length + 1,
              };
            }

            found = true;
            return;
          }
        }

        // Handle binary expressions (logical-and) - when alternate is empty, it might be a logical-and
        if (isBinaryExpression(expr)) {
          const binaryExpr = expr as BinaryExpression;
          if (binaryExpr.operator === "&&") {
            const rightSpan = getExpressionSpan(binaryExpr.right);
            const matchesByRight =
              !matchesBySpan && rightSpan?.start === consequentSpanStart && consequentSpanStart !== 0;

            if (matchesBySpan || matchesByRight) {
              if (!isStringLiteral(binaryExpr.right)) return;

              binaryExpr.right = createStringLiteralWithClass(binaryExpr.right.value, className);
              found = true;
              return;
            }
          }
        }
      }
    },
  });

  return transformedAst;
}
