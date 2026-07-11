import { DEFINED_CHECK_OPERATORS, EQUALITY_OPERATORS, NUMBER_OPERATORS } from "../constants";

export function isValidOperator(operator: string, propertyType: string | null | undefined): boolean {
  if (DEFINED_CHECK_OPERATORS.includes(operator)) {
    return true;
  }

  if (propertyType === "number") {
    return NUMBER_OPERATORS.includes(operator);
  }
  if (propertyType === "string" || propertyType === "boolean") {
    return EQUALITY_OPERATORS.includes(operator);
  }

  return EQUALITY_OPERATORS.includes(operator);
}
