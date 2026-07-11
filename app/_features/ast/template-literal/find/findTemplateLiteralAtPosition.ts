import { getSpan } from "@ast/core/get/getSpan";
import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";

export function findTemplateLiteralAtPosition(ast: Module, nodeStart: number): boolean {
  let found = false;
  simple(ast, {
    TemplateLiteral(node) {
      if (found) return;
      const templateSpan = getSpan(node);
      if (templateSpan.start === nodeStart) {
        found = true;
      }
    },
  });
  return found;
}
