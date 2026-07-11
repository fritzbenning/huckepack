import type { Module } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { ensurePropsSpread } from "./ensurePropsSpread";

// Mock dependencies
vi.mock("@ast/utils", () => ({
  transformAST: vi.fn((ast, visitor) => {
    // Simple manual traversal for test sake
    // We know structure of our mock AST
    const root = ast.body[0];
    if (root.type === "ReturnStatement") {
      visitor.ReturnStatement(root);
    }
    return { ast: { ...ast } };
  }),
}));

vi.mock("./addPropsSpread", () => ({
  addPropsSpread: vi.fn((opening) => {
    // Simulate adding call
    opening.attributes.push({ type: "SpreadElement", arguments: { value: "props" } });
  }),
}));

vi.mock("./hasPropsSpread", () => ({
  hasPropsSpread: vi.fn((opening) => {
    return opening.attributes.some((a: unknown) => {
      const attr = a as { type: string; arguments?: { value: string } };
      return attr.type === "SpreadElement" && attr.arguments?.value === "props";
    });
  }),
}));

describe("ensurePropsSpread", () => {
  it("should add props spread to root JSX element in return statement", () => {
    const mockAst = {
      body: [
        {
          type: "ReturnStatement",
          argument: {
            type: "JSXElement",
            opening: {
              attributes: [],
            },
          },
        },
      ],
    } as unknown as Module;

    ensurePropsSpread(mockAst);

    const returnStmt = mockAst.body[0] as unknown as Record<string, unknown>;
    const returnArg = returnStmt.argument as Record<string, unknown>;
    const opening = returnArg.opening as Record<string, unknown>;
    const attributes = opening.attributes as unknown[];
    expect(attributes).toHaveLength(1);
    expect((attributes[0] as Record<string, unknown>).type).toBe("SpreadElement");
  });

  it("should add props spread to root JSX fragment child", () => {
    const mockAst = {
      body: [
        {
          type: "ReturnStatement",
          argument: {
            type: "JSXFragment",
            children: [
              { type: "JSXText", value: "\n" },
              {
                type: "JSXElement",
                opening: { attributes: [] },
              },
            ],
          },
        },
      ],
    } as unknown as Module;

    ensurePropsSpread(mockAst);

    const fragment = (mockAst.body[0] as unknown as Record<string, unknown>).argument as Record<string, unknown>;
    const children = fragment.children as unknown[];
    const child = children[1] as Record<string, unknown>;
    const opening = child.opening as Record<string, unknown>;
    expect(opening.attributes as unknown[]).toHaveLength(1);
  });

  it("should handle parenthesized expression", () => {
    const mockAst = {
      body: [
        {
          type: "ReturnStatement",
          argument: {
            type: "ParenthesisExpression",
            expression: {
              type: "JSXElement",
              opening: { attributes: [] },
            },
          },
        },
      ],
    } as unknown as Module;

    ensurePropsSpread(mockAst);

    const inner = (mockAst.body[0] as unknown as Record<string, unknown>).argument as Record<string, unknown>;
    const expression = inner.expression as Record<string, unknown>;
    const opening = expression.opening as Record<string, unknown>;
    expect(opening.attributes as unknown[]).toHaveLength(1);
  });
});
