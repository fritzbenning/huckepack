import { isStringLiteral } from "@ast/type-check";
import { splitStringLiteral } from "@ast/string-literal/format";
import type { Expression } from "@swc/wasm-web";

export function extractClasses(node: Expression): string[] {
  if (isStringLiteral(node)) {
    return splitStringLiteral(node.value);
  }
  return [];
}
