import type { Module } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { transformAST } from "./transformAST";

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

describe("transformAST", () => {
  it("should transform AST and return found=true if visitor returns true", () => {
    const ast = withSpan({
      type: "Module",
      body: [{ type: "ExpressionStatement", expression: { type: "Identifier", value: "foo", optional: false } }],
    }) as unknown as Module;

    const { ast: result, found } = transformAST(ast, {
      ExpressionStatement(node: unknown) {
        const nodeRecord = node as Record<string, unknown>;
        nodeRecord.changed = true;
        return true;
      },
    });

    expect(found).toBe(true);
    expect((result.body[0] as unknown as Record<string, unknown>).changed).toBe(true);
  });

  it("should transform AST but return found=false if visitor returns false/undefined", () => {
    const ast = withSpan({
      type: "Module",
      body: [{ type: "ExpressionStatement", expression: { type: "Identifier", value: "foo", optional: false } }],
    }) as unknown as Module;

    const { found } = transformAST(ast, {
      ExpressionStatement(node: unknown) {
        const nodeRecord = node as Record<string, unknown>;
        nodeRecord.changed = true;
      },
    });

    expect(found).toBe(false);
  });

  it("should stop traversing once found is true (optimization check)", () => {
    const ast = withSpan({
      type: "Module",
      body: [
        { type: "ExpressionStatement", expression: { type: "Identifier", value: "foo", optional: false } },
        { type: "ExpressionStatement", expression: { type: "Identifier", value: "bar", optional: false } },
      ],
    }) as unknown as Module;

    let count = 0;
    transformAST(ast, {
      ExpressionStatement() {
        count++;
        return true;
      },
    });

    expect(count).toBe(1);
  });
});
