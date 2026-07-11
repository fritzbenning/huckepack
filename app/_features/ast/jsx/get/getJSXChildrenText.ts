import { isJSXExpressionContainer, isJSXText } from "@ast/type-check";
import type { JSXElement } from "@swc/wasm-web";

export function getJSXChildrenText(element: JSXElement): string | null {
  if (!element.children || element.children.length === 0) {
    return null;
  }

  const textParts: string[] = [];

  for (const child of element.children) {
    if (isJSXText(child)) {
      const textValue = child.value.trim();
      if (textValue) {
        textParts.push(textValue);
      }
    } else if (isJSXExpressionContainer(child)) {
      // For expression containers, try to extract string literals
      const expr = child.expression;
      if (expr.type === "StringLiteral") {
        textParts.push(expr.value);
      }
    }
  }

  return textParts.length > 0 ? textParts.join(" ") : null;
}
