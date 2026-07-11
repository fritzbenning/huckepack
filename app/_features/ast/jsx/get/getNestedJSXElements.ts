import {
  isBinaryExpression,
  isConditionalExpression,
  isJSXElement,
  isJSXExpressionContainer,
  isJSXFragment,
} from "@ast/type-check";
import type { JSXElement, JSXElementChild } from "@swc/wasm-web";
import { getJSXElementFromExpression } from "./getJSXElementFromExpression";

export function getNestedJSXElements(child: JSXElementChild): JSXElement[] {
  if (isJSXElement(child)) {
    return [child];
  }

  if (isJSXExpressionContainer(child)) {
    const expr = child.expression;

    // Handle conditional expressions: condition ? <A /> : <B />
    if (isConditionalExpression(expr)) {
      const consequent = getJSXElementFromExpression(expr.consequent);
      const alternate = getJSXElementFromExpression(expr.alternate);
      return [...consequent, ...alternate];
    }

    // Handle binary expressions: condition && <A />
    if (isBinaryExpression(expr)) {
      const left = getJSXElementFromExpression(expr.left);
      const right = getJSXElementFromExpression(expr.right);
      return [...left, ...right];
    }

    // Handle direct JSXElement in expression
    return getJSXElementFromExpression(expr);
  }

  if (isJSXFragment(child)) {
    const elements: JSXElement[] = [];
    for (const fragmentChild of child.children) {
      elements.push(...getNestedJSXElements(fragmentChild));
    }
    return elements;
  }

  return [];
}
