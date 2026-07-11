import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import { getExpressionSpan } from "@ast/core/get/getExpressionSpan";
import { isBinaryExpression, isStringLiteral, isTemplateLiteral } from "@ast/type-check";
import type { BinaryExpression, ConditionalExpression, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { createTransformedAST } from "@ast/utils";

export function convertLogicalToConditional(ast: Module, expressionSpanStart: number, className: string): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  simple(transformedAst, {
    TemplateLiteral(node) {
      if (found || !isTemplateLiteral(node)) return;

      for (let i = 0; i < node.expressions.length; i++) {
        const expr = node.expressions[i];
        const exprSpan = getExpressionSpan(expr);

        if (isBinaryExpression(expr)) {
          const binaryExpr = expr as BinaryExpression;

          // Check if this is a logical-and expression at the target span
          if (binaryExpr.operator === "&&" && exprSpan && exprSpan.start === expressionSpanStart) {
            // Get the test (left side) and consequent classes (right side)
            const test = binaryExpr.left;
            const consequent = binaryExpr.right;

            // Ensure consequent is a string literal
            if (!isStringLiteral(consequent)) {
              console.error("Consequent must be a string literal");
              return;
            }

            // Get existing classes from consequent
            const existingClasses = consequent.value.trim();
            const newAlternateClasses = className.trim();

            // Create the alternate string literal with the new class
            const alternate = createStringLiteral(newAlternateClasses);

            // Create the conditional expression: test ? "existing classes" : "new class"
            const conditionalExpr: ConditionalExpression = {
              type: "ConditionalExpression",
              span: {
                start: exprSpan.start,
                end: exprSpan.end + newAlternateClasses.length + 10, // Approximate new end
                ctxt: 0,
              },
              test,
              consequent,
              alternate,
            };

            // Replace the binary expression with conditional expression
            node.expressions[i] = conditionalExpr;
            found = true;
            return;
          }
        }
      }
    },
  });

  if (!found) {
    console.error(`Logical-and expression not found at span start ${expressionSpanStart}`);
  }

  return transformedAst;
}
