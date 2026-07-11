import { isStringLiteral } from "@ast/type-check";
import { removeClassToken } from "@ast/utils";
import { createTransformedAST } from "@ast/utils";
import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";

export function removeValueFromStringLiteral(ast: Module, start: number, valueToRemove: string): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  simple(transformedAst, {
    StringLiteral(node) {
      if (node.span.start === start && isStringLiteral(node)) {
        const newValue = removeClassToken(node.value, valueToRemove);
        node.value = newValue;
        node.raw = `"${newValue}"`;
        found = true;
      }
    },
  });

  if (!found) {
    console.error("String literal not found at start", start);
  }

  return transformedAst;
}
