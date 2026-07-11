import type { ConditionState, Operator, PropertyType } from "../types";
import { getOperatorConfig } from "./getOperatorConfig";

export function getPropertyTypeConversion(
  fromType: PropertyType,
  toType: PropertyType,
  currentOperator: Operator,
  currentTestValue: string | number | boolean | null,
  currentState: ConditionState
): { operator: Operator; testValue: string | number | boolean } {
  if (toType === "boolean") {
    // Converting TO boolean
    if (currentState.isBooleanCheck) {
      // Preserve boolean check
      return {
        operator: currentState.normalizedOperator === "&&" ? "&&" : "!&&",
        testValue: "",
      };
    } else if (currentState.isDefinedCheck) {
      // Convert defined check to boolean true
      return { operator: "&&", testValue: "" };
    } else {
      // Convert equality check to boolean true
      return { operator: "&&", testValue: "" };
    }
  }

  if (fromType === "boolean") {
    // Converting FROM boolean
    if (currentState.isBooleanCheck) {
      // Convert boolean check to equality check
      const toTypeConfig = getOperatorConfig(toType, null, null);
      return { operator: toTypeConfig.defaultOperator, testValue: toTypeConfig.defaultTestValue };
    }
  }

  // Same type or non-boolean conversions
  if (currentState.isDefinedCheck && (toType === "string" || toType === "number" || toType === "union")) {
    // Keep defined check
    return { operator: currentOperator || "&&", testValue: "" };
  }

  if (currentTestValue !== null && currentTestValue !== undefined) {
    // Try to preserve test value
    // Special case: string to number conversion
    if (fromType === "string" && toType === "number") {
      if (currentTestValue === "") {
        // Empty string converts to 0
        return { operator: currentOperator || "===", testValue: 0 };
      }
      // Try to convert string to number
      const numValue = Number(currentTestValue);
      if (!Number.isNaN(numValue)) {
        // Valid number conversion
        return { operator: currentOperator || "===", testValue: numValue };
      }
      // Invalid number - use default from config
      const toTypeConfig = getOperatorConfig(toType, null, null);
      return { operator: currentOperator || "===", testValue: toTypeConfig.defaultTestValue };
    }
    return { operator: currentOperator || "===", testValue: currentTestValue };
  }

  // Default conversion - use config defaults
  const toTypeConfig = getOperatorConfig(toType, null, null);
  return { operator: toTypeConfig.defaultOperator, testValue: toTypeConfig.defaultTestValue };
}
