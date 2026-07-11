import type { Expression, Identifier, JSXExpressionContainer, TemplateLiteral } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { processJSXExpressionContainer } from "./processJSXExpressionContainer";

vi.mock("@ast/type-check", () => ({
  isIdentifier: vi.fn((node: Expression): node is Identifier => {
    return (node as Identifier).type === "Identifier";
  }),
  isTemplateLiteral: vi.fn((node: Expression): node is TemplateLiteral => {
    return (node as TemplateLiteral).type === "TemplateLiteral";
  }),
}));

vi.mock("./template-literal/processTemplateLiteral", () => ({
  processTemplateLiteral: vi.fn(() => ({
    type: "TemplateLiteral",
    classTokens: ["class1", "class2"],
    segments: [],
    span: { start: 0, end: 20, ctxt: 0 },
  })),
}));

describe("processJSXExpressionContainer", () => {
  it("should process TemplateLiteral expression", () => {
    const container: JSXExpressionContainer = {
      type: "JSXExpressionContainer",
      span: { start: 0, end: 20, ctxt: 0 },
      expression: {
        type: "TemplateLiteral",
        span: { start: 0, end: 20, ctxt: 0 },
        expressions: [],
        quasis: [],
      },
    };

    const result = processJSXExpressionContainer(container);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("TemplateLiteral");
  });

  it("should return null for Identifier expression", () => {
    const container = {
      type: "JSXExpressionContainer",
      span: { start: 0, end: 10, ctxt: 0 },
      expression: {
        type: "Identifier",
        span: { start: 0, end: 10, ctxt: 0 },
        value: "className",
        optional: false,
      } as Expression,
    } as JSXExpressionContainer;

    const result = processJSXExpressionContainer(container);

    expect(result).toBeNull();
  });

  it("should return null for unsupported expression type", () => {
    const container: JSXExpressionContainer = {
      type: "JSXExpressionContainer",
      span: { start: 0, end: 10, ctxt: 0 },
      expression: {
        type: "CallExpression",
        span: { start: 0, end: 10, ctxt: 0 },
      } as Expression,
    };

    const result = processJSXExpressionContainer(container);

    expect(result).toBeNull();
  });
});
