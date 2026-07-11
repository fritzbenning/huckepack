import { isBooleanLiteral, isJSXExpressionContainer, isNumericLiteral, isStringLiteral } from "@ast/type-check";
import type { JSXAttribute } from "@swc/wasm-web";

/**
 * Extracts the value from a JSX attribute
 * Returns the value as string, number, boolean, or null if not a simple literal
 */
export function getJSXAttributeValue(attr: JSXAttribute): string | number | boolean | null {
  if (!attr.value) {
    // Boolean attribute without value (e.g., <input disabled />)
    return true;
  }

  // String literal value
  if (isStringLiteral(attr.value)) {
    return attr.value.value;
  }

  // JSX expression container
  if (isJSXExpressionContainer(attr.value)) {
    const expression = attr.value.expression;

    if (isStringLiteral(expression)) {
      return expression.value;
    }

    if (isNumericLiteral(expression)) {
      return expression.value;
    }

    if (isBooleanLiteral(expression)) {
      return expression.value;
    }

    // Complex expression, return null
    return null;
  }

  return null;
}

