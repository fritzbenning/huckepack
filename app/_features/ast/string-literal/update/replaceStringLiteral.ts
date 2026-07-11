import { isStringLiteral } from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";

export function replaceStringLiteral(ast: Module, start: number, newValue: string): Module {
  const transformedAst = createTransformedAST(ast);

  simple(transformedAst, {
    StringLiteral(node) {
      if (node.span.start === start && isStringLiteral(node)) {
        node.value = newValue;
        node.raw = `"${newValue}"`;
      }
    },
  });

  return transformedAst;
}
