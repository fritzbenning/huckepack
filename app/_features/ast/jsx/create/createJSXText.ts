import { createSpan } from "@ast/core/create/createSpan";
import type { JSXText } from "@swc/wasm-web";

export function createJSXText(value: string): JSXText {
  return {
    type: "JSXText",
    span: createSpan(),
    value,
    raw: value,
  };
}
