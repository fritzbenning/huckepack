import { createSpan } from "@ast/core/create/createSpan";
import type { Expression, JSXExpressionContainer } from "@swc/wasm-web";

export function createJSXExpressionContainer(expression: Expression): JSXExpressionContainer {
  return {
    type: "JSXExpressionContainer",
    span: createSpan(),
    expression,
  };
}
