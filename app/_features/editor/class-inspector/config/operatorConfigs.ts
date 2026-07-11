import { DEFINED_CHECK_OPERATORS, EQUALITY_OPERATORS, NUMBER_OPERATORS, OPERATOR_OPTIONS } from "../constants";
import type { OperatorConfig } from "../types";

type ConfigValue = Omit<OperatorConfig, "isDefinedCheck" | "isBooleanCheck" | "showValueInput">;

const BASE_CONFIGS: {
  boolean: ConfigValue;
  number: ConfigValue;
  string: ConfigValue;
  union: ConfigValue;
  null: ConfigValue;
  undefined: ConfigValue;
} = {
  boolean: {
    availableOperators: OPERATOR_OPTIONS.filter((op) => EQUALITY_OPERATORS.includes(op.value)),
    showOperatorDropdown: false,
    defaultTestValue: true,
    defaultOperator: "&&",
  },
  number: {
    availableOperators: [
      ...OPERATOR_OPTIONS.filter((op) => DEFINED_CHECK_OPERATORS.includes(op.value)),
      ...OPERATOR_OPTIONS.filter((op) => NUMBER_OPERATORS.includes(op.value)),
    ],
    showOperatorDropdown: true,
    defaultTestValue: 10,
    defaultOperator: "===",
  },
  string: {
    availableOperators: [
      ...OPERATOR_OPTIONS.filter((op) => DEFINED_CHECK_OPERATORS.includes(op.value)),
      ...OPERATOR_OPTIONS.filter((op) => EQUALITY_OPERATORS.includes(op.value)),
    ],
    showOperatorDropdown: true,
    defaultTestValue: "Value",
    defaultOperator: "===",
  },
  union: {
    availableOperators: [
      ...OPERATOR_OPTIONS.filter((op) => DEFINED_CHECK_OPERATORS.includes(op.value)),
      ...OPERATOR_OPTIONS.filter((op) => EQUALITY_OPERATORS.includes(op.value)),
    ],
    showOperatorDropdown: true,
    defaultTestValue: "",
    defaultOperator: "===",
  },
  null: {
    availableOperators: [
      ...OPERATOR_OPTIONS.filter((op) => DEFINED_CHECK_OPERATORS.includes(op.value)),
      ...OPERATOR_OPTIONS.filter((op) => EQUALITY_OPERATORS.includes(op.value)),
    ],
    showOperatorDropdown: true,
    defaultTestValue: "",
    defaultOperator: "===",
  },
  undefined: {
    availableOperators: [
      ...OPERATOR_OPTIONS.filter((op) => DEFINED_CHECK_OPERATORS.includes(op.value)),
      ...OPERATOR_OPTIONS.filter((op) => EQUALITY_OPERATORS.includes(op.value)),
    ],
    showOperatorDropdown: true,
    defaultTestValue: "",
    defaultOperator: "===",
  },
};

export const OPERATOR_CONFIGS = BASE_CONFIGS;
