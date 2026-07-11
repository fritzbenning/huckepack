import { OPERATOR_CONFIGS } from "../config/operatorConfigs";
import { DEFINED_CHECK_OPERATORS } from "../constants";
import type { Operator, OperatorConfig, PropertyType } from "../types";

export function getOperatorConfig(
  propertyType: PropertyType,
  operator: Operator,
  testValue: string | number | boolean | null
): OperatorConfig {
  const baseConfig =
    propertyType === null || propertyType === undefined ? OPERATOR_CONFIGS.null : OPERATOR_CONFIGS[propertyType];

  const isBooleanType = propertyType === "boolean";
  const isDefinedCheckOperator = operator && DEFINED_CHECK_OPERATORS.includes(operator);
  const isDefinedCheck = !isBooleanType && !!isDefinedCheckOperator;
  const isEmptyTestValue = testValue === null || testValue === "";
  const isBooleanCheck = !!(isBooleanType && isDefinedCheckOperator && isEmptyTestValue);

  return {
    ...baseConfig,
    isDefinedCheck,
    isBooleanCheck,
    showValueInput: isBooleanType ? true : !isDefinedCheck,
  };
}
