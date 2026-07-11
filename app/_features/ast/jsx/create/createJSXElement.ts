import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type { JSXElement, JSXElementChild } from "@swc/wasm-web";

// Creates a JSX element AST node
export function createJSXElement(name: string, children: JSXElementChild[] = []): JSXElement {
  return {
    type: "JSXElement",
    span: createSpan(),
    opening: {
      type: "JSXOpeningElement",
      span: createSpan(),
      name: createIdentifier(name, 1), // JSX element names use ctxt: 1
      attributes: [],
      selfClosing: false,
    },
    closing: {
      type: "JSXClosingElement",
      span: createSpan(),
      name: createIdentifier(name, 1), // JSX element names use ctxt: 1
    },
    children,
  };
}
