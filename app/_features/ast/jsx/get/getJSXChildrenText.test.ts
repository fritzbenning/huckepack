import type { JSXElement, JSXElementChild, JSXExpressionContainer, JSXText } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { getJSXChildrenText } from "./getJSXChildrenText";

describe("getJSXChildrenText", () => {
  it("should return null for element with no children", () => {
    const mockElement: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 20, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 15, end: 20, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 17, end: 20, ctxt: 1 }, optional: false },
      },
      children: [],
    };

    const result = getJSXChildrenText(mockElement);
    expect(result).toBeNull();
  });

  it("should return null for element with empty children array", () => {
    const mockElement: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 20, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 15, end: 20, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 17, end: 20, ctxt: 1 }, optional: false },
      },
      children: undefined as unknown as JSXElementChild[],
    };

    const result = getJSXChildrenText(mockElement);
    expect(result).toBeNull();
  });

  it("should extract text from JSXText children", () => {
    const mockElement: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 30, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 25, end: 30, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 27, end: 30, ctxt: 1 }, optional: false },
      },
      children: [
        {
          type: "JSXText",
          span: { start: 5, end: 15, ctxt: 0 },
          value: "Hello World",
          raw: "Hello World",
        } as JSXText,
      ],
    };

    const result = getJSXChildrenText(mockElement);
    expect(result).toBe("Hello World");
  });

  it("should extract text from multiple JSXText children", () => {
    const mockElement: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 40, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 35, end: 40, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 37, end: 40, ctxt: 1 }, optional: false },
      },
      children: [
        {
          type: "JSXText",
          span: { start: 5, end: 11, ctxt: 0 },
          value: "Hello ",
          raw: "Hello ",
        } as JSXText,
        {
          type: "JSXText",
          span: { start: 11, end: 16, ctxt: 0 },
          value: "World",
          raw: "World",
        } as JSXText,
      ],
    };

    const result = getJSXChildrenText(mockElement);
    expect(result).toBe("Hello World");
  });

  it("should extract text from JSXExpressionContainer with StringLiteral", () => {
    const mockElement: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 30, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 25, end: 30, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 27, end: 30, ctxt: 1 }, optional: false },
      },
      children: [
        {
          type: "JSXExpressionContainer",
          span: { start: 5, end: 20, ctxt: 0 },
          expression: {
            type: "StringLiteral",
            span: { start: 6, end: 19, ctxt: 0 },
            value: "Expression Text",
            raw: '"Expression Text"',
          },
        } as JSXExpressionContainer,
      ],
    };

    const result = getJSXChildrenText(mockElement);
    expect(result).toBe("Expression Text");
  });

  it("should ignore JSXExpressionContainer with non-StringLiteral expressions", () => {
    const mockElement: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 30, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 25, end: 30, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 27, end: 30, ctxt: 1 }, optional: false },
      },
      children: [
        {
          type: "JSXExpressionContainer",
          span: { start: 5, end: 20, ctxt: 0 },
          expression: {
            type: "Identifier",
            span: { start: 6, end: 19, ctxt: 0 },
            value: "someVariable",
            ctxt: 0,
            optional: false,
          },
        } as JSXExpressionContainer,
      ],
    };

    const result = getJSXChildrenText(mockElement);
    expect(result).toBeNull();
  });

  it("should trim whitespace from JSXText values", () => {
    const mockElement: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 30, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 25, end: 30, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 27, end: 30, ctxt: 1 }, optional: false },
      },
      children: [
        {
          type: "JSXText",
          span: { start: 5, end: 15, ctxt: 0 },
          value: "   Hello   ",
          raw: "   Hello   ",
        } as JSXText,
        {
          type: "JSXText",
          span: { start: 15, end: 25, ctxt: 0 },
          value: "   World   ",
          raw: "   World   ",
        } as JSXText,
      ],
    };

    const result = getJSXChildrenText(mockElement);
    expect(result).toBe("Hello World");
  });

  it("should return null when all text is whitespace", () => {
    const mockElement: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 30, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 25, end: 30, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 27, end: 30, ctxt: 1 }, optional: false },
      },
      children: [
        {
          type: "JSXText",
          span: { start: 5, end: 15, ctxt: 0 },
          value: "   \n\t   ",
          raw: "   \n\t   ",
        } as JSXText,
      ],
    };

    const result = getJSXChildrenText(mockElement);
    expect(result).toBeNull();
  });

  it("should handle mixed JSXText and JSXExpressionContainer children", () => {
    const mockElement: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 50, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 45, end: 50, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 47, end: 50, ctxt: 1 }, optional: false },
      },
      children: [
        {
          type: "JSXText",
          span: { start: 5, end: 11, ctxt: 0 },
          value: "Hello ",
          raw: "Hello ",
        } as JSXText,
        {
          type: "JSXExpressionContainer",
          span: { start: 11, end: 25, ctxt: 0 },
          expression: {
            type: "StringLiteral",
            span: { start: 12, end: 24, ctxt: 0 },
            value: "Beautiful",
            raw: '"Beautiful"',
          },
        } as JSXExpressionContainer,
        {
          type: "JSXText",
          span: { start: 25, end: 31, ctxt: 0 },
          value: " World",
          raw: " World",
        } as JSXText,
      ],
    };

    const result = getJSXChildrenText(mockElement);
    expect(result).toBe("Hello Beautiful World");
  });
});
