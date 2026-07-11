import type { Module } from "@swc/wasm-web";

export function createTransformedAST(ast: Module): Module {
  try {
    return structuredClone(ast);
  } catch (error) {
    console.warn(`Failed to deep clone AST, falling back to shallow clone:`, error);
    return { ...ast, body: [...ast.body] };
  }
}
