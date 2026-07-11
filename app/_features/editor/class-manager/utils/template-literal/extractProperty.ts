import { isIdentifier, isMemberExpression } from "@ast/type-check";
import type { Expression } from "@swc/wasm-web";

export function extractProperty(node: Expression): string | null {
  if (isIdentifier(node)) {
    return node.value;
  }
  if (isMemberExpression(node)) {
    const obj = extractProperty(node.object);
    const prop = isIdentifier(node.property) ? node.property.value : "?";
    return obj ? `${obj}.${prop}` : null;
  }
  return null;
}
