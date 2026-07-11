import { isJSXExpressionContainer } from "@ast/type-check";
import { isIdentifier, isMemberExpression } from "@ast/type-check";
import type { JSXElement } from "@swc/wasm-web";

export function getPropertyNameFromJSXChildren(element: JSXElement): string | null {
  if (!element.children || element.children.length === 0) {
    return null;
  }

  for (const child of element.children) {
    if (isJSXExpressionContainer(child)) {
      const expr = child.expression;

      if (isIdentifier(expr)) {
        return expr.value;
      }

      if (isMemberExpression(expr)) {
        const object = expr.object;
        const property = expr.property;

        if (isIdentifier(object) && isIdentifier(property)) {
          const objectName = object.value.toLowerCase();
          if (objectName === "props" || objectName === "rest") {
            return property.value;
          }
        }
      }
    }
  }

  return null;
}

