import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { createTransformedAST } from "./createTransformedAST";

export function transformNodeAtPosition<T extends { span?: { start?: number } }>(
  ast: Module,
  nodeType: string,
  start: number,
  transformer: (node: T) => void
): { ast: Module; found: boolean } {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  const visitor = {
    [nodeType](node: unknown) {
      const typedNode = node as T;
      if (typedNode.span?.start === start) {
        transformer(typedNode);
        found = true;
      }
    },
  };

  simple(transformedAst, visitor);

  return { ast: transformedAst, found };
}

