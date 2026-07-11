import { createSpan } from "@ast/core/create/createSpan";
import { createExpressionFromValue } from "@ast/expression/create/createExpressionFromValue";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createJSXAttribute } from "@ast/jsx/create/createJSXAttribute";
import { createJSXExpressionContainer } from "@ast/jsx/create/createJSXExpressionContainer";
import type { JSXAttribute } from "@swc/wasm-web";

export function createJSXAttributeWithValue(name: string, value: string | number | boolean): JSXAttribute {
  if (typeof value === "string") {
    return createJSXAttribute(name, value);
  }

  // For numbers and booleans, create an expression container
  const expression = createExpressionFromValue(value);
  const attr: JSXAttribute = {
    type: "JSXAttribute",
    span: createSpan(),
    name: createIdentifier(name, 1), // JSX attribute names use ctxt: 1
    value: createJSXExpressionContainer(expression),
  };

  return attr;
}
