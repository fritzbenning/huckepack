import { getExpressionSpan } from "@ast/core/get/getExpressionSpan";
import { createBinaryExpression } from "@ast/expression/create/createBinaryExpression";
import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import { isConditionalExpression, isStringLiteral, isTemplateLiteral } from "@ast/type-check";
import { removeClassToken } from "@ast/utils";
import { createTransformedAST } from "@ast/utils";
import type { BinaryExpression, ConditionalExpression, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";

export function removeClass(ast: Module, alternateSpanStart: number, className: string): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  simple(transformedAst, {
    TemplateLiteral(node) {
      if (found || !isTemplateLiteral(node)) return;

      for (let i = 0; i < node.expressions.length; i++) {
        const expr = node.expressions[i];

        if (isConditionalExpression(expr)) {
          const conditionalExpr = expr as ConditionalExpression;
          const alternateSpan = getExpressionSpan(conditionalExpr.alternate);

          // Check if this alternate branch matches the target span
          if (alternateSpan && alternateSpan.start === alternateSpanStart) {
            // Ensure alternate is a string literal
            if (!isStringLiteral(conditionalExpr.alternate)) {
              console.error("Alternate must be a string literal");
              return;
            }

            // Remove the class from alternate
            const newAlternateValue = removeClassToken(conditionalExpr.alternate.value, className);

            // If alternate becomes empty, convert back to logical-and
            if (newAlternateValue === "") {
              // Get the test and consequent
              const test = conditionalExpr.test;
              const consequent = conditionalExpr.consequent;

              // Ensure consequent is a string literal
              if (!isStringLiteral(consequent)) {
                console.error("Consequent must be a string literal");
                return;
              }

              // Create logical-and expression: test && "consequent classes"
              const exprSpan = getExpressionSpan(expr);
              const binaryExpr: BinaryExpression = createBinaryExpression(
                test,
                "&&",
                consequent,
                exprSpan?.start || 0,
                exprSpan?.end || 0
              );

              // Replace conditional expression with binary expression
              node.expressions[i] = binaryExpr;
            } else {
              // Update the alternate string literal with remaining classes
              conditionalExpr.alternate = createStringLiteral(newAlternateValue);

              // Update the span to reflect the new length
              const exprSpan = getExpressionSpan(expr);
              if (exprSpan) {
                conditionalExpr.span = {
                  ...conditionalExpr.span,
                  end: exprSpan.end - className.length - 1, // Approximate new end
                };
              }
            }

            found = true;
            return;
          }
        }
      }
    },
  });

  if (!found) {
    console.error(`Conditional alternate branch not found at span start ${alternateSpanStart}`);
  }

  return transformedAst;
}
