import { isStringLiteral } from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";

export function replaceValueInStringLiteral(ast: Module, start: number, oldValue: string, newValue: string): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  simple(transformedAst, {
    StringLiteral(node) {
      if (node.span.start === start && isStringLiteral(node)) {
        const updatedValue = node.value.replace(oldValue, newValue).replace(/\s+/g, " ").trim();
        node.value = updatedValue;
        node.raw = `"${updatedValue}"`;
        found = true;
      }
    },
  });

  if (!found) {
    console.error("String literal not found at start", start);
  }

  return transformedAst;
}
