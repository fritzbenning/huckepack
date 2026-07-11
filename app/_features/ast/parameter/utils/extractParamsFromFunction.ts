import { getSpan } from "@ast/core/get/getSpan";
import type { FormattedParam } from "@project/ast-parser";
import type {
  AssignmentPatternProperty,
  BooleanLiteral,
  FunctionExpression,
  NumericLiteral,
  ObjectPattern,
  StringLiteral,
} from "@swc/wasm-web";

export function extractParamsFromFunction(declaration: FunctionExpression): Record<string, FormattedParam> {
  const formattedParams: Record<string, FormattedParam> = {};

  if (!declaration.params || declaration.params.length === 0) {
    return formattedParams;
  }

  const param = declaration.params[0];

  let pattern: ObjectPattern | undefined;

  if (param?.pat?.type === "ObjectPattern") {
    pattern = param.pat as ObjectPattern;
  } else if (
    param &&
    typeof param === "object" &&
    "type" in param &&
    (param as { type?: string }).type === "ObjectPattern"
  ) {
    pattern = param as unknown as ObjectPattern;
  }

  if (pattern?.properties) {
    pattern.properties.forEach((prop) => {
      if (prop.type === "RestElement" || !("key" in prop) || !prop.key) {
        return;
      }

      const assignmentParam = prop as AssignmentPatternProperty;
      const value = assignmentParam.value as StringLiteral | NumericLiteral | BooleanLiteral;
      const type = value?.type ?? "unknown";
      const defaultValue = value?.value ?? null;
      const span = value ? getSpan(value) : undefined;

      if (assignmentParam.key && "value" in assignmentParam.key) {
        const paramName = assignmentParam.key.value;
        formattedParams[paramName] = {
          type,
          defaultValue,
          span,
        };
      }
    });
  }

  return formattedParams;
}
