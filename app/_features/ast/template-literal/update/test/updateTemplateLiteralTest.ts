import { getExpressionSpan } from "@ast/core/get/getExpressionSpan";
import { createBinaryExpression } from "@ast/expression/create/createBinaryExpression";
import { createExpressionFromValue } from "@ast/expression/create/createExpressionFromValue";
import { createUnaryExpression } from "@ast/expression/create/createUnaryExpression";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import { getStringLiteralValue } from "@ast/string-literal/get/getStringLiteralValue";
import {
  isBinaryExpression,
  isConditionalExpression,
  isIdentifier,
  isStringLiteral,
  isTemplateLiteral,
  isUnaryExpression,
} from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type { BinaryExpression, ConditionalExpression, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";

export function updateTemplateLiteralTest(
  ast: Module,
  testSpanStart: number,
  left: string,
  operator: string,
  right: string | number | boolean
): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;
  let originalSpanEnd = testSpanStart + 10;

  // Check if this is an "is defined" or "is undefined" check
  const isDefinedCheck = operator === "&&" && right === "";
  const isUndefinedCheck = operator === "!&&" && right === "";

  simple(transformedAst, {
    TemplateLiteral(node) {
      if (found || !isTemplateLiteral(node)) return;

      for (let i = 0; i < node.expressions.length; i++) {
        const expr = node.expressions[i];
        const exprSpan = getExpressionSpan(expr);

        if (isConditionalExpression(expr)) {
          const conditionalExpr = expr as ConditionalExpression;
          const testSpan = getExpressionSpan(conditionalExpr.test);
          if (testSpan && testSpan.start === testSpanStart) {
            originalSpanEnd = testSpan.end;

            if (isDefinedCheck || isUndefinedCheck) {
              const leftExpr = createIdentifier(left, 3);
              const testExpr = isUndefinedCheck
                ? createUnaryExpression(leftExpr, "!", testSpanStart, originalSpanEnd)
                : leftExpr;

              // Check if alternate has classes
              const alternateValue = isStringLiteral(conditionalExpr.alternate)
                ? getStringLiteralValue(conditionalExpr.alternate)
                : "";
              const hasAlternateClasses = alternateValue.trim().length > 0;

              if (hasAlternateClasses) {
                // Keep as conditional expression but update the test
                conditionalExpr.test = testExpr;
              } else {
                // Convert to logical-and expression (no alternate to preserve)
                const existingClasses = isStringLiteral(conditionalExpr.consequent)
                  ? conditionalExpr.consequent.value
                  : "";

                const preservedStringLiteral = createStringLiteral(existingClasses);
                const binaryExpr = createBinaryExpression(
                  testExpr,
                  "&&",
                  preservedStringLiteral,
                  exprSpan?.start || testSpanStart,
                  exprSpan?.end || originalSpanEnd
                );
                node.expressions[i] = binaryExpr;
              }
            } else {
              const leftExpr = createIdentifier(left, 3);
              const rightExpr = createExpressionFromValue(right);
              const newTest = createBinaryExpression(leftExpr, operator, rightExpr, testSpanStart, originalSpanEnd);
              conditionalExpr.test = newTest;
            }
            found = true;
            return;
          }
        }

        if (isBinaryExpression(expr)) {
          const binaryExpr = expr as BinaryExpression;
          const leftSpan = getExpressionSpan(binaryExpr.left);

          if (
            (binaryExpr.operator === "&&" || binaryExpr.operator === "||") &&
            leftSpan &&
            leftSpan.start === testSpanStart
          ) {
            originalSpanEnd = leftSpan.end;

            // For "is defined" or "is undefined" checks, update the entire binary expression
            if (isDefinedCheck || isUndefinedCheck) {
              // Use ctxt: 3 for identifiers that reference function parameters in template literals
              const leftExpr = createIdentifier(left, 3);
              const testExpr = isUndefinedCheck
                ? createUnaryExpression(leftExpr, "!", testSpanStart, originalSpanEnd)
                : leftExpr;

              // Preserve existing classes from right side
              const existingClasses = isStringLiteral(binaryExpr.right) ? binaryExpr.right.value : "";

              const preservedStringLiteral = createStringLiteral(existingClasses);
              const newBinaryExpr = createBinaryExpression(
                testExpr,
                "&&",
                preservedStringLiteral,
                exprSpan?.start || testSpanStart,
                exprSpan?.end || originalSpanEnd
              );
              node.expressions[i] = newBinaryExpr;
            } else {
              const leftExpr = createIdentifier(left, 3);
              const rightExpr = createExpressionFromValue(right);
              const newTest = createBinaryExpression(leftExpr, operator, rightExpr, testSpanStart, originalSpanEnd);
              binaryExpr.left = newTest;
            }
            found = true;
            return;
          }

          if (exprSpan && exprSpan.start === testSpanStart) {
            originalSpanEnd = exprSpan.end;

            const leftExpr = createIdentifier(left, 3);
            const rightExpr = createExpressionFromValue(right);
            const newTest = createBinaryExpression(leftExpr, operator, rightExpr, testSpanStart, originalSpanEnd);

            node.expressions[i] = newTest;
            found = true;
            return;
          }
        }

        if (isUnaryExpression(expr)) {
          // Handle updating a unary expression (for "is undefined" checks)
          const unarySpan = getExpressionSpan(expr);
          if (unarySpan && unarySpan.start === testSpanStart) {
            originalSpanEnd = unarySpan.end;

            if (isDefinedCheck || isUndefinedCheck) {
              const leftExpr = createIdentifier(left, 3);
              const testExpr = isUndefinedCheck
                ? createUnaryExpression(leftExpr, "!", testSpanStart, originalSpanEnd)
                : leftExpr;
              // No existing classes to preserve when converting from unary expression
              const emptyStringLiteral = createStringLiteral("");
              const binaryExpr = createBinaryExpression(
                testExpr,
                "&&",
                emptyStringLiteral,
                testSpanStart,
                originalSpanEnd + left.length + (isUndefinedCheck ? 5 : 4) // Approximate length
              );
              node.expressions[i] = binaryExpr;
            } else {
              const leftExpr = createIdentifier(left, 3);
              const rightExpr = createExpressionFromValue(right);
              const newTest = createBinaryExpression(leftExpr, operator, rightExpr, testSpanStart, originalSpanEnd);
              node.expressions[i] = newTest;
            }
            found = true;
            return;
          }
        }

        if (isIdentifier(expr)) {
          if (exprSpan && exprSpan.start === testSpanStart) {
            originalSpanEnd = exprSpan.end;

            const leftExpr = createIdentifier(left, 3);

            // If this is an "is defined" or "is undefined" check, create a logical-and expression
            if (isDefinedCheck || isUndefinedCheck) {
              const testExpr = isUndefinedCheck
                ? createUnaryExpression(leftExpr, "!", testSpanStart, originalSpanEnd)
                : leftExpr;
              // No existing classes to preserve when converting from identifier
              const emptyStringLiteral = createStringLiteral("");
              const binaryExpr = createBinaryExpression(
                testExpr,
                "&&",
                emptyStringLiteral,
                testSpanStart,
                originalSpanEnd + left.length + (isUndefinedCheck ? 5 : 4) // Approximate: property + " && " + "" or "!property && " + ""
              );
              node.expressions[i] = binaryExpr;
            } else {
              const rightExpr = createExpressionFromValue(right);
              const newTest = createBinaryExpression(leftExpr, operator, rightExpr, testSpanStart, originalSpanEnd);
              node.expressions[i] = newTest;
            }
            found = true;
            return;
          }
        }
      }
    },
  });

  if (!found) {
    console.error(`Test expression not found at span start ${testSpanStart}`);
  }

  return transformedAst;
}
