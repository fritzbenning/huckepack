import type { Module, ReturnStatement } from "@swc/wasm-web";
import { simple } from "swc-walk";

export function findReturnStatement(ast: Module): ReturnStatement | null {
  let foundReturn: ReturnStatement | null = null;

  simple(ast, {
    ReturnStatement(node) {
      if (!foundReturn) {
        foundReturn = node as ReturnStatement;
      }
    },
  });

  return foundReturn;
}

