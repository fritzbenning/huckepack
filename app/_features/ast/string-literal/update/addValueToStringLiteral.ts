import { isStringLiteral } from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";

export function addValueToStringLiteral(ast: Module, start: number, valueToAdd: string): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  simple(transformedAst, {
    StringLiteral(node) {
      if (node.span.start === start && isStringLiteral(node)) {
        const newValue = `${node.value} ${valueToAdd}`.replace(/\s+/g, " ").trim();
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
