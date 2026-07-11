import type { ExpressionStatement, JSXElement, Module } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { addClassNameAttributeToJSXElement } from "./addClassNameAttribute";

// Mock dependencies
vi.mock("@ast/utils", () => ({
  transformAST: vi.fn((ast, visitor) => {
    const transformedAst = { ...ast };
    if (ast.body[0] && "expression" in ast.body[0] && ast.body[0].expression) {
      const node = ast.body[0].expression;
      if (visitor.JSXElement && typeof visitor.JSXElement === "function") {
        visitor.JSXElement(node);
      }
    }
    return { ast: transformedAst, found: false };
  }),
}));

vi.mock("@ast/core/get/getSpan", () => ({
  getSpan: vi.fn((node) => node.span || { start: 0, end: 0 }),
}));

vi.mock("./createJSXAttribute", () => ({
  createJSXAttribute: vi.fn((name, value) => ({
    type: "JSXAttribute",
    name: { value: name },
    value: { value: value, span: { start: 99 } }, // Mock span for return
  })),
}));

describe("addClassNameAttributeToJSXElement", () => {
  it("should add className if not present", () => {
    const mockAst: Module = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement" as const,
          span: { start: 0, end: 100, ctxt: 0 },
          expression: {
            type: "JSXElement" as const,
            span: { start: 10, end: 50, ctxt: 0 },
            opening: {
              type: "JSXOpeningElement" as const,
              span: { start: 10, end: 15, ctxt: 0 },
              name: {
                type: "Identifier" as const,
                value: "div",
                span: { start: 11, end: 14, ctxt: 1 },
                optional: false,
              },
              attributes: [],
              selfClosing: false,
            },
            closing: {
              type: "JSXClosingElement" as const,
              span: { start: 45, end: 50, ctxt: 0 },
              name: {
                type: "Identifier" as const,
                value: "div",
                span: { start: 47, end: 50, ctxt: 1 },
                optional: false,
              },
            },
            children: [],
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const { classNameSpanStart } = addClassNameAttributeToJSXElement(mockAst, 10, "foo");

    expect(classNameSpanStart).toBe(99);
    const exprStmt = mockAst.body[0] as ExpressionStatement;
    const jsxElement = exprStmt.expression as JSXElement;
    expect(jsxElement.opening.attributes).toHaveLength(1);
    expect((jsxElement.opening.attributes[0] as { value?: { value?: string } }).value?.value).toBe("foo");
  });

  it("should not add className if already present", () => {
    const mockAst: Module = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement" as const,
          span: { start: 0, end: 100, ctxt: 0 },
          expression: {
            type: "JSXElement" as const,
            span: { start: 10, end: 50, ctxt: 0 },
            opening: {
              type: "JSXOpeningElement" as const,
              span: { start: 10, end: 15, ctxt: 0 },
              name: {
                type: "Identifier" as const,
                value: "div",
                span: { start: 11, end: 14, ctxt: 1 },
                optional: false,
              },
              attributes: [
                {
                  type: "JSXAttribute" as const,
                  span: { start: 15, end: 35, ctxt: 0 },
                  name: {
                    type: "Identifier" as const,
                    value: "className",
                    span: { start: 16, end: 25, ctxt: 1 },
                    optional: false,
                  },
                  value: {
                    type: "StringLiteral" as const,
                    span: { start: 26, end: 35, ctxt: 0 },
                    value: "existing",
                    raw: '"existing"',
                  },
                },
              ],
              selfClosing: false,
            },
            closing: {
              type: "JSXClosingElement" as const,
              span: { start: 45, end: 50, ctxt: 0 },
              name: {
                type: "Identifier" as const,
                value: "div",
                span: { start: 47, end: 50, ctxt: 1 },
                optional: false,
              },
            },
            children: [],
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const { classNameSpanStart } = addClassNameAttributeToJSXElement(mockAst, 10, "foo");

    expect(classNameSpanStart).toBeNull();
    const exprStmt = mockAst.body[0] as ExpressionStatement;
    const jsxElement = exprStmt.expression as JSXElement;
    expect(jsxElement.opening.attributes).toHaveLength(1);
    expect((jsxElement.opening.attributes[0] as { value?: { value?: string } }).value?.value).toBe("existing");
  });

  it("should ignore element if start position mismatch", () => {
    const mockAst: Module = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement" as const,
          span: { start: 0, end: 100, ctxt: 0 },
          expression: {
            type: "JSXElement" as const,
            span: { start: 20, end: 50, ctxt: 0 },
            opening: {
              type: "JSXOpeningElement" as const,
              span: { start: 20, end: 25, ctxt: 0 },
              name: {
                type: "Identifier" as const,
                value: "div",
                span: { start: 21, end: 24, ctxt: 1 },
                optional: false,
              },
              attributes: [],
              selfClosing: false,
            },
            closing: {
              type: "JSXClosingElement" as const,
              span: { start: 45, end: 50, ctxt: 0 },
              name: {
                type: "Identifier" as const,
                value: "div",
                span: { start: 47, end: 50, ctxt: 1 },
                optional: false,
              },
            },
            children: [],
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const { classNameSpanStart } = addClassNameAttributeToJSXElement(mockAst, 10, "foo");
    expect(classNameSpanStart).toBeNull();
    const exprStmt = mockAst.body[0] as ExpressionStatement;
    const jsxElement = exprStmt.expression as JSXElement;
    expect(jsxElement.opening.attributes).toHaveLength(0);
  });
});
