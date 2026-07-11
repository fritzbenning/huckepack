import { createBooleanLiteral } from "@ast/literal/create/createBooleanLiteral";
import { createNumericLiteral } from "@ast/literal/create/createNumericLiteral";
import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import type { Expression } from "@swc/wasm-web";

export function createExpressionFromValue(value: string | number | boolean): Expression {
  if (typeof value === "number") {
    return createNumericLiteral(value);
  }

  if (typeof value === "boolean") {
    return createBooleanLiteral(value);
  }

  return createStringLiteral(value);
}
