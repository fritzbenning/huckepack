export interface SemanticClassGroup {
  category: string;
  tokens: string[];
}

export type SemanticClassGroupsMap = Record<string, string[]>;

export type ClassSuggestionsByCategory = Record<string, string[]>;

export type TestValueSegments = {
  property: string | null;
  propertyType: string | null;
  operator: string | null;
  testValue: string | number | boolean | null;
};

export type TestValueSegmentsWithHandlers = TestValueSegments & {
  updateProperty: (property: string) => void;
  updateOperator: (operator: string) => void;
  updateTestValue: (testValue: string) => void;
};

export type PropertyType = "boolean" | "string" | "number" | "union" | null | undefined;
export type Operator = "===" | "!==" | "<" | ">" | "<=" | ">=" | "&&" | "!&&" | null | "!";

export interface OperatorConfig {
  /** Available operators for this property type */
  availableOperators: Array<{ value: string; label: string }>;
  /** Whether to show the operator dropdown */
  showOperatorDropdown: boolean;
  /** Whether to show the value input */
  showValueInput: boolean;
  /** Whether this is a defined/undefined check (for non-boolean properties) */
  isDefinedCheck: boolean;
  /** Whether this is a boolean check (for boolean properties) */
  isBooleanCheck: boolean;
  /** Default test value when creating new conditions */
  defaultTestValue: string | number | boolean;
  /** Default operator when creating new conditions */
  defaultOperator: Operator;
}

export interface ConditionState {
  propertyType: PropertyType;
  operator: Operator;
  testValue: string | number | boolean | null;
  /** Whether the operator needs normalization (e.g., identifier -> && for boolean) */
  needsNormalization: boolean;
  /** The normalized operator to use */
  normalizedOperator: Operator;
  /** The normalized test value to use */
  normalizedTestValue: string | number | boolean | null;
  /** Whether this is a defined/undefined check (for non-boolean properties) */
  isDefinedCheck: boolean;
  /** Whether this is a boolean check (for boolean properties) */
  isBooleanCheck: boolean;
}
