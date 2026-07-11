import { createSpan } from "@ast/core/create/createSpan";
import { getSpan } from "@ast/core/get/getSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { isJSXText } from "@ast/type-check";
import { transformASTOrNull } from "@ast/utils";
import type { JSXElement, JSXElementChild, JSXText, Module } from "@swc/wasm-web";
import { createJSXText } from "../create/createJSXText";

// Updates the children of a JSX element
export function updateJSXChildren(ast: Module, elementSpanStart: number, childrenValue: string | null): Module | null {
  return transformASTOrNull(ast, {
    JSXElement(node: unknown) {
      const jsxElement = node as JSXElement;
      const span = getSpan(jsxElement);
      if (span.start !== elementSpanStart) return false;

      if (childrenValue === null || childrenValue === "") {
        jsxElement.children = [];
        jsxElement.opening.selfClosing = true;
        (jsxElement as unknown as { closing: null }).closing = null;
      } else {
        const existingTextNodeIndex = jsxElement.children.findIndex((child) => isJSXText(child) && child.value.trim() !== "");

        if (existingTextNodeIndex >= 0) {
          const existingTextNode = jsxElement.children[existingTextNodeIndex] as JSXText;
          existingTextNode.value = childrenValue;
          existingTextNode.raw = childrenValue;
        } else {
          const textChildren: JSXElementChild[] = [];
          textChildren.push(createJSXText(childrenValue));

          jsxElement.children = textChildren;
        }

        jsxElement.opening.selfClosing = false;
        if (!jsxElement.closing) {
          const elementName = jsxElement.opening.name.type === "Identifier" ? jsxElement.opening.name.value : "div";
          (jsxElement as { closing: { type: "JSXClosingElement"; span: unknown; name: unknown } }).closing = {
            type: "JSXClosingElement",
            span: createSpan(),
            name: createIdentifier(elementName, 1),
          };
        }
      }
      return true;
    },
  });
}
