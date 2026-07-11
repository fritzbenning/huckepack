import { isStringLiteral } from "@ast/type-check";
import type { Expression } from "@swc/wasm-web";

export function getStringLiteralValue(node: Expression): string {
  if (isStringLiteral(node)) {
    return node.value;
  }
  return "";
}
