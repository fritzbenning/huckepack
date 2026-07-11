import { isJSXElement, isJSXFragment, isParenthesisExpression } from "@ast/type-check";
import type { Expression, JSXElement } from "@swc/wasm-web";
import { getNestedJSXElements } from "./getNestedJSXElements";

export function getRootJSXElement(expression: Expression): JSXElement | null {
  let rootExpression = expression;

  if (isParenthesisExpression(rootExpression)) {
    rootExpression = rootExpression.expression;
  }

  if (isJSXFragment(rootExpression)) {
    // Handle JSXFragment: extract all nested JSX elements
    const fragment = rootExpression;
    // Get all JSX elements from all fragment children
    const jsxElements: JSXElement[] = [];
    for (const child of fragment.children) {
      jsxElements.push(...getNestedJSXElements(child));
    }
    return jsxElements.length > 0 ? jsxElements[0] : null;
  } else if (isJSXElement(rootExpression)) {
    // Handle single JSXElement
    return rootExpression;
  }

  return null;
}
