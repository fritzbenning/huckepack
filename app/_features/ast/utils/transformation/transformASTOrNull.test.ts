import type { Module } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { transformASTOrNull } from "./transformAST";

function withSpan<T>(node: T): T {
  if (typeof node === "object" && node !== null) {
    const nodeRecord = node as Record<string, unknown>;
    if (!nodeRecord.span) nodeRecord.span = { start: 0, end: 0, ctxt: 0 };
    for (const key in nodeRecord) {
      if (key === "span") continue;
      if (Array.isArray(nodeRecord[key])) {
        (nodeRecord[key] as unknown[]).forEach(withSpan);
      } else if (typeof nodeRecord[key] === "object") {
        withSpan(nodeRecord[key]);
      }
    }
  }
  return node;
}

describe("transformASTOrNull", () => {
  it("should return AST if found", () => {
    const ast = withSpan({
      type: "Module",
      body: [{ type: "ExpressionStatement", expression: { type: "Identifier", value: "foo", optional: false } }],
    }) as unknown as Module;
    const result = transformASTOrNull(ast, {
      ExpressionStatement: () => true,
    });
    expect(result).not.toBeNull();
  });

  it("should return null if not found", () => {
    const ast = withSpan({
      type: "Module",
      body: [{ type: "ExpressionStatement", expression: { type: "Identifier", value: "foo", optional: false } }],
    }) as unknown as Module;
    const result = transformASTOrNull(ast, {
      ExpressionStatement: () => false,
    });
    expect(result).toBeNull();
  });
});
