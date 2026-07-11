import { getSpan } from "@ast/core/get/getSpan";
import { getStringLiteralValue } from "@ast/string-literal/get/getStringLiteralValue";
import { isBinaryExpression, isConditionalExpression, isStringLiteral } from "@ast/type-check";
import type { Expression } from "@swc/wasm-web";
import type { ExpressionSegment } from "../../types";
import { extractClasses } from "../string-literal/extractClasses";
import { extractTestValue } from "./extractTestValue";

export function processExpression(expr: Expression): ExpressionSegment {
  if (isConditionalExpression(expr)) {
    const parsedTest = extractTestValue(expr.test);

    // Detect defined/undefined checks in conditional expressions
    // When test is just an identifier (property) or unary !, it's a defined/undefined check
    const isDefinedCheckInConditional =
      parsedTest.operator === null && parsedTest.property !== null && parsedTest.testValue === null;
    const isUndefinedCheckInConditional =
      parsedTest.operator === "!" && parsedTest.property !== null && parsedTest.testValue === null;

    return {
      kind: "expression",
      expressionType: "conditional",
      test: {
        ...parsedTest,
        operator: isDefinedCheckInConditional ? "&&" : isUndefinedCheckInConditional ? "!&&" : parsedTest.operator,
        testValue: isDefinedCheckInConditional || isUndefinedCheckInConditional ? "" : parsedTest.testValue,
        span: getSpan(expr.test),
      },
      consequent: {
        classes: extractClasses(expr.consequent),
        raw: getStringLiteralValue(expr.consequent),
        span: getSpan(expr.consequent),
      },
      alternate: {
        classes: extractClasses(expr.alternate),
        raw: getStringLiteralValue(expr.alternate),
        span: getSpan(expr.alternate),
      },
      span: getSpan(expr),
    };
  }

  // Handle BinaryExpression with logical operators: test && "classes" or test || "classes"
  if (isBinaryExpression(expr)) {
    if (expr.operator === "&&" || expr.operator === "||") {
      const parsedTest = extractTestValue(expr.left);
      const rightValue = getStringLiteralValue(expr.right);
      const isRightStringLiteral = isStringLiteral(expr.right);

      const isDefinedCheck =
        expr.operator === "&&" && parsedTest.operator === null && parsedTest.property !== null && isRightStringLiteral;

      const isUndefinedCheck =
        expr.operator === "&&" && parsedTest.operator === "!" && parsedTest.property !== null && isRightStringLiteral;

      return {
        kind: "expression",
        expressionType: expr.operator === "&&" ? "logical-and" : "logical-or",
        test: {
          ...parsedTest,
          operator: isDefinedCheck ? "&&" : isUndefinedCheck ? "!&&" : parsedTest.operator,
          testValue: isDefinedCheck || isUndefinedCheck ? "" : parsedTest.testValue,
          span: getSpan(expr.left),
        },
        operator: expr.operator,
        consequent: {
          classes: extractClasses(expr.right),
          raw: rightValue,
          span: getSpan(expr.right),
        },
        alternate: null,
        span: getSpan(expr),
      };
    }
  }

  // Fallback for unknown expression types
  return {
    kind: "expression",
    expressionType: "unknown",
    raw: JSON.stringify(expr),
    span: getSpan(expr),
  };
}
