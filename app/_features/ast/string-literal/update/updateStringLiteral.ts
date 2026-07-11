import { isStringLiteral } from "@ast/type-check";
import { transformAST, updateClassTokens } from "@ast/utils";
import type { Module } from "@swc/wasm-web";

// Updates a string literal by adding and removing class tokens
export function updateStringLiteral(
  ast: Module,
  start: number,
  classesToAdd: string[],
  classesToRemove: string[]
): Module {
  const { ast: transformedAst, found } = transformAST(ast, {
    StringLiteral(node: unknown) {
      const stringNode = node as { span: { start: number }; value: string; raw: string };
      if (stringNode.span.start === start && isStringLiteral(stringNode)) {
        const newValue = updateClassTokens(stringNode.value, classesToAdd, classesToRemove);
        stringNode.value = newValue;
        stringNode.raw = `"${newValue}"`;
        return true;
      }
      return false;
    },
  });

  if (!found) {
    console.error("String literal not found at start", start);
  }

  return transformedAst;
}
