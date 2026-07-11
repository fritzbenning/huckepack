import { getExpressionSpan } from "@ast/core/get/getExpressionSpan";
import { getSpan } from "@ast/core/get/getSpan";
import { isBinaryExpression, isConditionalExpression, isTemplateLiteral } from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { getQuasiValue } from "../../utils/quasiValue";
import { convertTemplateLiteralToStringLiteral } from "../conversion/convertTemplateLiteralToStringLiteral";

export function removeConditionalSegment(ast: Module, expressionSpanStart: number): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;
  let templateSpanStart: number | null = null;
  let shouldConvertToStringLiteral = false;

  simple(transformedAst, {
    TemplateLiteral(node) {
      if (found || !isTemplateLiteral(node)) return;

      const templateSpan = getSpan(node);
      templateSpanStart = templateSpan.start;

      for (let i = 0; i < node.expressions.length; i++) {
        const expr = node.expressions[i];
        const exprSpan = getExpressionSpan(expr);

        // Handle conditional expressions
        if (isConditionalExpression(expr)) {
          const testSpan = getExpressionSpan(expr.test);
          // Try matching by expression span first, then fall back to test span
          if (
            (exprSpan && exprSpan.start === expressionSpanStart) ||
            (testSpan && testSpan.start === expressionSpanStart)
          ) {
            node.expressions.splice(i, 1);

            // Merge the quasi after the expression with the quasi before it to preserve static classes
            if (i + 1 < node.quasis.length) {
              const quasiAfter = node.quasis[i + 1];
              const quasiBefore = node.quasis[i];

              // Get values from both quasis
              const valueAfter = getQuasiValue(quasiAfter);
              const valueBefore = getQuasiValue(quasiBefore);

              // Merge: combine the values, normalizing whitespace
              const mergedValue = `${valueBefore.trim()} ${valueAfter.trim()}`.trim();

              // Update the quasi before with the merged value
              quasiBefore.cooked = mergedValue;
              quasiBefore.raw = mergedValue;
              quasiBefore.span.end = quasiBefore.span.start + mergedValue.length;

              // Remove the quasi after
              node.quasis.splice(i + 1, 1);

              if (node.quasis.length > 0) {
                node.quasis.forEach((quasi) => {
                  quasi.tail = false;
                });
                const lastQuasiIndex = node.quasis.length - 1;
                node.quasis[lastQuasiIndex].tail = true;
              }
            }

            // Check if this was the last expression
            if (node.expressions.length === 0) {
              shouldConvertToStringLiteral = true;
            }

            found = true;
            return;
          }
        }

        // Handle binary expressions (logical-and and logical-or)
        if (isBinaryExpression(expr)) {
          if (expr.operator === "&&" || expr.operator === "||") {
            const leftSpan = getExpressionSpan(expr.left);
            // Try matching by expression span first, then fall back to left (test) span
            if (
              (exprSpan && exprSpan.start === expressionSpanStart) ||
              (leftSpan && leftSpan.start === expressionSpanStart)
            ) {
              node.expressions.splice(i, 1);

              // Merge the quasi after the expression with the quasi before it to preserve static classes
              if (i + 1 < node.quasis.length) {
                const quasiAfter = node.quasis[i + 1];
                const quasiBefore = node.quasis[i];

                // Get values from both quasis
                const valueAfter = getQuasiValue(quasiAfter);
                const valueBefore = getQuasiValue(quasiBefore);

                // Merge: combine the values, normalizing whitespace
                const mergedValue = `${valueBefore.trim()} ${valueAfter.trim()}`.trim();

                // Update the quasi before with the merged value
                quasiBefore.cooked = mergedValue;
                quasiBefore.raw = mergedValue;
                quasiBefore.span.end = quasiBefore.span.start + mergedValue.length;

                // Remove the quasi after
                node.quasis.splice(i + 1, 1);

                if (node.quasis.length > 0) {
                  node.quasis.forEach((quasi) => {
                    quasi.tail = false;
                  });
                  const lastQuasiIndex = node.quasis.length - 1;
                  node.quasis[lastQuasiIndex].tail = true;
                }
              }

              // Check if this was the last expression
              if (node.expressions.length === 0) {
                shouldConvertToStringLiteral = true;
              }

              found = true;
              return;
            }
          }
        }
      }
    },
  });

  if (!found) {
    console.error(`Expression not found at span start ${expressionSpanStart}`);
    return transformedAst;
  }

  // If this was the last expression, convert template literal back to string literal
  if (shouldConvertToStringLiteral && templateSpanStart !== null) {
    return convertTemplateLiteralToStringLiteral(transformedAst, templateSpanStart);
  }

  return transformedAst;
}
