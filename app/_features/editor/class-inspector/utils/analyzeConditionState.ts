import type { ConditionState, Operator, PropertyType } from "../types";
import { getOperatorConfig } from "./getOperatorConfig";

export function analyzeConditionState(
  propertyType: PropertyType,
  operator: Operator,
  testValue: string | number | boolean | null,
  property: string | null
): ConditionState {
  const isBooleanType = propertyType === "boolean";
  const isEmptyTestValue = testValue === null || testValue === "";

  // Detect identifier/unary tests that need normalization
  const isIdentifierTest = operator === null && property !== null;
  const isUnaryTest = operator === "!" && property !== null;
  const needsNormalization = isBooleanType && (isIdentifierTest || isUnaryTest);

  // Determine normalized operator
  let normalizedOperator: Operator = operator;
  if (needsNormalization) {
    normalizedOperator = isIdentifierTest ? "&&" : "!&&";
  } else if (isBooleanType && operator === "&&" && isEmptyTestValue) {
    normalizedOperator = "&&";
  } else if (isBooleanType && operator === "!&&" && isEmptyTestValue) {
    normalizedOperator = "!&&";
  }

  // Determine normalized test value
  let normalizedTestValue: string | number | boolean | null = testValue;
  if (isBooleanType) {
    if (normalizedOperator === "&&" && isEmptyTestValue) {
      normalizedTestValue = true;
    } else if (normalizedOperator === "!&&" && isEmptyTestValue) {
      normalizedTestValue = false;
    }
  }

  // Get config to determine check types
  const config = getOperatorConfig(propertyType, normalizedOperator, normalizedTestValue);

  return {
    propertyType,
    operator,
    testValue,
    needsNormalization,
    normalizedOperator,
    normalizedTestValue,
    isDefinedCheck: config.isDefinedCheck,
    isBooleanCheck: config.isBooleanCheck,
  };
}
