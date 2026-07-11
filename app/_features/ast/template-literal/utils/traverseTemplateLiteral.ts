import { getSpan } from "@ast/core/get/getSpan";
import { isTemplateLiteral } from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type { Module, TemplateLiteral } from "@swc/wasm-web";
import { simple } from "swc-walk";

// Traverses a template literal at the given span start and calls the callback with the found node
export function traverseTemplateLiteral(
  ast: Module,
  nodeStart: number,
  callback: (node: TemplateLiteral) => void | boolean
): { ast: Module; found: boolean } {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  simple(transformedAst, {
    TemplateLiteral(node) {
      if (found || !isTemplateLiteral(node)) return;

      const templateSpan = getSpan(node);
      if (templateSpan.start !== nodeStart) return;

      const result = callback(node);
      // If callback returns false, don't mark as found
      if (result !== false) {
        found = true;
      }
    },
  });

  return { ast: transformedAst, found };
}
