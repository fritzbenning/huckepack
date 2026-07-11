import type { Expression, JSXAttribute, JSXOpeningElement, JSXExpressionContainer, StringLiteral, TemplateLiteral } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { analyzeClasses } from "./analyzeClasses";

vi.mock("@ast/jsx/get", () => ({
  getClassAttribute: vi.fn((opening: JSXOpeningElement) => {
    return opening.attributes.find((attr) => {
      if (attr.type === "JSXAttribute") {
        const name = attr.name.type === "Identifier" ? attr.name.value : "";
        return name === "className";
      }
      return false;
    }) as JSXAttribute | undefined;
  }),
}));

vi.mock("@ast/type-check", () => ({
  isStringLiteral: vi.fn((node: Expression): node is StringLiteral => {
    return (node as StringLiteral).type === "StringLiteral";
  }),
  isJSXExpressionContainer: vi.fn((node: Expression): node is JSXExpressionContainer => {
    return (node as JSXExpressionContainer).type === "JSXExpressionContainer";
  }),
}));

vi.mock("../utils/string-literal/processStringLiteral", () => ({
  processStringLiteral: vi.fn(() => ({
    type: "StringLiteral",
    classTokens: ["class1", "class2"],
    value: "class1 class2",
    span: { start: 0, end: 20, ctxt: 0 },
  })),
}));

vi.mock("../utils/processJSXExpressionContainer", () => ({
  processJSXExpressionContainer: vi.fn(() => ({
    type: "TemplateLiteral",
    classTokens: ["class1", "class2"],
    segments: [],
    span: { start: 0, end: 20, ctxt: 0 },
  })),
}));

describe("analyzeClasses", () => {
  it("should analyze StringLiteral className", () => {
    const opening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 30, ctxt: 0 },
      name: {
        type: "Identifier",
        span: { start: 1, end: 4, ctxt: 0 },
        value: "div",
        optional: false,
      },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 25, ctxt: 0 },
          name: {
            type: "Identifier",
            span: { start: 5, end: 13, ctxt: 0 },
            value: "className",
            optional: false,
          },
          value: {
            type: "StringLiteral",
            span: { start: 14, end: 25, ctxt: 0 },
            value: "class1 class2",
            raw: '"class1 class2"',
          },
        },
      ],
      selfClosing: false,
    };

    const result = analyzeClasses(opening);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("StringLiteral");
  });

  it("should analyze JSXExpressionContainer with TemplateLiteral", () => {
    const opening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 30, ctxt: 0 },
      name: {
        type: "Identifier",
        span: { start: 1, end: 4, ctxt: 0 },
        value: "div",
        optional: false,
      },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 25, ctxt: 0 },
          name: {
            type: "Identifier",
            span: { start: 5, end: 13, ctxt: 0 },
            value: "className",
            optional: false,
          },
          value: {
            type: "JSXExpressionContainer",
            span: { start: 14, end: 25, ctxt: 0 },
            expression: {
              type: "TemplateLiteral",
              span: { start: 15, end: 24, ctxt: 0 },
              expressions: [],
              quasis: [],
            },
          },
        },
      ],
      selfClosing: false,
    };

    const result = analyzeClasses(opening);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("TemplateLiteral");
  });

  it("should return null when no className attribute exists", () => {
    const opening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 10, ctxt: 0 },
      name: {
        type: "Identifier",
        span: { start: 1, end: 4, ctxt: 0 },
        value: "div",
        optional: false,
      },
      attributes: [],
      selfClosing: false,
    };

    const result = analyzeClasses(opening);

    expect(result).toBeNull();
  });

  it("should return null when className attribute has no value", () => {
    const opening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: {
        type: "Identifier",
        span: { start: 1, end: 4, ctxt: 0 },
        value: "div",
        optional: false,
      },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 15, ctxt: 0 },
          name: {
            type: "Identifier",
            span: { start: 5, end: 13, ctxt: 0 },
            value: "className",
            optional: false,
          },
          value: null,
        },
      ],
      selfClosing: false,
    };

    const result = analyzeClasses(opening);

    expect(result).toBeNull();
  });
});

