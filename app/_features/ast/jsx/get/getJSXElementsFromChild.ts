import { isJSXElement, isJSXExpressionContainer, isJSXFragment } from "@ast/type-check";
import type { JSXElement, JSXElementChild } from "@swc/wasm-web";
import { getJSXElementFromExpression } from "./getJSXElementFromExpression";

export function getJSXElementsFromChild(child: unknown): JSXElement[] {
  if (!child || typeof child !== "object") return [];

  const childNode = child as JSXElementChild;

  if (isJSXElement(childNode)) {
    return [childNode];
  }

  if (isJSXExpressionContainer(childNode)) {
    return getJSXElementFromExpression(childNode.expression);
  }

  if (isJSXFragment(childNode)) {
    const elements: JSXElement[] = [];
    if (childNode.children) {
      for (const fragmentChild of childNode.children) {
        elements.push(...getJSXElementsFromChild(fragmentChild));
      }
    }
    return elements;
  }

  return [];
}
