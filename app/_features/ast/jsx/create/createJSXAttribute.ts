import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import type { JSXAttribute } from "@swc/wasm-web";

export function createJSXAttribute(name: string, value: string): JSXAttribute {
  return {
    type: "JSXAttribute",
    span: createSpan(),
    name: createIdentifier(name, 1), // JSX attribute names use ctxt: 1
    value: createStringLiteral(value),
  };
}
