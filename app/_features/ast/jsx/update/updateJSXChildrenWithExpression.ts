import { createSpan } from "@ast/core/create/createSpan";
import { getSpan } from "@ast/core/get/getSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { transformASTOrNull } from "@ast/utils";
import { createJSXExpressionContainer } from "../create/createJSXExpressionContainer";
import type { JSXElement, JSXElementChild, Module } from "@swc/wasm-web";

export function updateJSXChildrenWithExpression(
  ast: Module,
  elementSpanStart: number,
  propName: string
): Module | null {
  return transformASTOrNull(ast, {
    JSXElement(node: unknown) {
      const jsxElement = node as JSXElement;
      const span = getSpan(jsxElement);
      if (span.start !== elementSpanStart) return false;

      const identifier = createIdentifier(propName, propName.length);
      const expressionContainer = createJSXExpressionContainer(identifier);

      const expressionChildren: JSXElementChild[] = [];
      expressionChildren.push(expressionContainer as unknown as JSXElementChild);

      jsxElement.children = expressionChildren;
      jsxElement.opening.selfClosing = false;
      if (!jsxElement.closing) {
        const elementName = jsxElement.opening.name.type === "Identifier" ? jsxElement.opening.name.value : "div";
        (jsxElement as { closing: { type: "JSXClosingElement"; span: unknown; name: unknown } }).closing = {
          type: "JSXClosingElement",
          span: createSpan(),
          name: createIdentifier(elementName, 1),
        };
      }
      return true;
    },
  });
}

