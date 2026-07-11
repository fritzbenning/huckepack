import { createSpan } from "@ast/core/create/createSpan";
import type { JSXElementChild, JSXFragment } from "@swc/wasm-web";

export function createJSXFragment(children: JSXElementChild[] = []): JSXFragment {
  return {
    type: "JSXFragment",
    span: createSpan(),
    opening: {
      type: "JSXOpeningFragment",
      span: createSpan(),
    },
    closing: {
      type: "JSXClosingFragment",
      span: createSpan(),
    },
    children,
  };
}
