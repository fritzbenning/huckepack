import type { JSXElement, Module, ReturnStatement } from "@swc/wasm-web";
import { printSync } from "@swc/wasm-web";

export function extractNodeCode(node: JSXElement, ast?: Module): string | undefined {
  if (!ast) return undefined;

  try {
    const returnStatement: ReturnStatement = {
      type: "ReturnStatement",
      span: node.span,
      argument: node,
    };

    const wrapperModule: Module = {
      ...ast,
      type: "Module",
      span: ast.span,
      body: [returnStatement],
    };

    const code = printSync(wrapperModule, {
      jsc: {
        target: "es2020",
        parser: {
          syntax: "typescript",
          tsx: true,
        },
      },
    }).code;

    // Remove the "return " prefix and any trailing semicolon
    return code
      .replace(/^\s*return\s+/, "")
      .replace(/;\s*$/, "")
      .trim();
  } catch (error) {
    console.error("[extractNodeCode] Error extracting code:", error);
    return undefined;
  }
}
