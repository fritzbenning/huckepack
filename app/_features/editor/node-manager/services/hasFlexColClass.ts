import { getClassAttribute } from "@ast/jsx/get";
import { isJSXExpressionContainer, isStringLiteral } from "@ast/type-check";
import type { JSXOpeningElement } from "@swc/wasm-web";

/**
 * Checks if a JSX element has the "flex-col" class in its className attribute
 */
export function hasFlexColClass(opening: JSXOpeningElement): boolean {
  const classAttribute = getClassAttribute(opening);
  if (!classAttribute?.value) return false;

  let classNameString = "";

  if (isStringLiteral(classAttribute.value)) {
    classNameString = classAttribute.value.value;
  } else if (isJSXExpressionContainer(classAttribute.value)) {
    // For template literals or expressions, we'd need more complex parsing
    // For now, we'll only handle simple string literals
    // This could be extended later if needed
    return false;
  }

  // Split by whitespace and check if "flex-col" is present
  const classes = classNameString.trim().split(/\s+/);
  return classes.includes("flex-col");
}

