import { DEFINED_CHECK_OPERATORS } from "../constants";

export function getTestValueForOperator(
  currentOperator: string | null,
  newOperator: string,
  propertyType: string | null,
  currentTestValue: string | number | boolean | null | undefined
): string | number | boolean {
  if (DEFINED_CHECK_OPERATORS.includes(newOperator)) {
    return "";
  }

  if (propertyType === "boolean") {
    const wasDefinedCheck = currentOperator && DEFINED_CHECK_OPERATORS.includes(currentOperator);

    if (wasDefinedCheck) {
      if (currentOperator === "&&") {
        return true;
      } else if (currentOperator === "!&&") {
        return false;
      } else {
        return true;
      }
    } else if (currentTestValue !== null && currentTestValue !== undefined) {
      return currentTestValue;
    } else {
      return true;
    }
  } else if (currentTestValue !== null && currentTestValue !== undefined) {
    return currentTestValue;
  } else {
    return "";
  }
}

