import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { createTransformedAST } from "./createTransformedAST";

type Visitor = Record<string, ((node: unknown, ...args: unknown[]) => unknown) | unknown>;

// Transforms AST using a visitor pattern, returns transformed AST and whether any match was found
export function transformAST(ast: Module, visitor: Visitor): { ast: Module; found: boolean } {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  // Wrap visitor methods to automatically track found flag and handle early exit
  const wrappedVisitor: Visitor = {};
  for (const [key, value] of Object.entries(visitor)) {
    if (typeof value === "function") {
      wrappedVisitor[key] = (node: unknown, ...args: unknown[]) => {
        if (found) return false;
        const result = value(node, ...args);
        // Only mark as found if the visitor explicitly returns a truthy value
        // Returning undefined or false means no match was found
        if (result === true) {
          found = true;
        }
        return result;
      };
    } else {
      wrappedVisitor[key] = value;
    }
  }

  simple(transformedAst, wrappedVisitor);
  return { ast: transformedAst, found };
}

// Transforms AST and returns null if no match was found, otherwise returns transformed AST
export function transformASTOrNull(ast: Module, visitor: Visitor): Module | null {
  const { ast: transformedAst, found } = transformAST(ast, visitor);
  return found ? transformedAst : null;
}
