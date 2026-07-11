export function translateOperator(operator: string | null | undefined): string {
  if (!operator) {
    return "";
  }

  const operatorMap: Record<string, string> = {
    "===": "equals",
    "!==": "not equals",
    "==": "equals",
    "!=": "not equals",
    "<": "is less than",
    ">": "isgreater than",
    "<=": "less than or equal",
    ">=": "greater than or equal",
  };

  return operatorMap[operator] || operator;
}
