import { isBooleanLiteral, isIdentifier, isMemberExpression, isNumericLiteral, isStringLiteral } from "@ast/type-check";
import type { Expression } from "@swc/wasm-web";
import { extractProperty } from "./extractProperty";

export function extractTestValuePart(node: Expression): string | number | boolean | null {
  if (isIdentifier(node)) {
    return node.value;
  }
  if (isNumericLiteral(node)) {
    return node.value;
  }
  if (isBooleanLiteral(node)) {
    return node.value;
  }
  if (isStringLiteral(node)) {
    return node.value;
  }
  if (isMemberExpression(node)) {
    const obj = extractProperty(node.object);
    const prop = isIdentifier(node.property) ? node.property.value : "?";
    return obj ? `${obj}.${prop}` : null;
  }
  return null;
}
