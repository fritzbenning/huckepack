import type { ExpressionStatement, Module } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { transformNodeAtPosition } from "./transformNodeAtPosition";

function withSpan(node: unknown): unknown {
  if (typeof node === "object" && node !== null) {
    const nodeRecord = node as Record<string, unknown>;
    if (!nodeRecord.span) {
      nodeRecord.span = { start: 0, end: 0, ctxt: 0 };
    }
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

describe("transformNodeAtPosition", () => {
  it("should transform node matching type and start position", () => {
    const ast = withSpan({
      type: "Module",
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 10, end: 20 },
          expression: { type: "Identifier", value: "foo", optional: false },
        },
      ],
    }) as unknown as Module;

    let called = false;
    const { found } = transformNodeAtPosition(ast, "ExpressionStatement", 10, (node) => {
      called = true;
      (node as Record<string, unknown>).visited = true;
    });

    expect(found).toBe(true);
    expect(called).toBe(true);
    expect((ast.body[0] as ExpressionStatement & { visited?: boolean }).visited).toBe(true);
  });

  it("should ignore node if start position mismatches", () => {
    const ast = withSpan({
      type: "Module",
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 15, end: 25 },
          expression: { type: "Identifier", value: "foo", optional: false },
        },
      ],
    }) as unknown as Module;

    const { found } = transformNodeAtPosition(ast, "ExpressionStatement", 10, () => {});
    expect(found).toBe(false);
  });
});
