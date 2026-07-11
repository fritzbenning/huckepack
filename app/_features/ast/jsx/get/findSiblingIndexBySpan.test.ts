import type { JSXElement } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { findSiblingIndexBySpan } from "./findSiblingIndexBySpan";

// Mock dependencies
vi.mock("@ast/core/get/getSpan", () => ({
  getSpan: vi.fn(),
}));

vi.mock("@ast/jsx", () => ({
  getNestedJSXElements: vi.fn(),
}));

vi.mock("@ast/type-check", () => ({
  isJSXElement: vi.fn(),
}));

describe("findSiblingIndexBySpan", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should find direct JSX element child by span", async () => {
    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 100, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 95, end: 100, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 97, end: 100, ctxt: 1 }, optional: false },
      },
      children: [
        {
          type: "JSXElement",
          span: { start: 10, end: 30, ctxt: 0 },
          opening: {
            type: "JSXOpeningElement",
            span: { start: 10, end: 15, ctxt: 0 },
            name: { type: "Identifier", value: "span", span: { start: 11, end: 15, ctxt: 1 }, optional: false },
            attributes: [],
            selfClosing: false,
          },
          closing: {
            type: "JSXClosingElement",
            span: { start: 25, end: 30, ctxt: 0 },
            name: { type: "Identifier", value: "span", span: { start: 27, end: 31, ctxt: 1 }, optional: false },
          },
          children: [],
        },
        {
          type: "JSXElement",
          span: { start: 35, end: 55, ctxt: 0 },
          opening: {
            type: "JSXOpeningElement",
            span: { start: 35, end: 40, ctxt: 0 },
            name: { type: "Identifier", value: "p", span: { start: 36, end: 37, ctxt: 1 }, optional: false },
            attributes: [],
            selfClosing: false,
          },
          closing: {
            type: "JSXClosingElement",
            span: { start: 50, end: 55, ctxt: 0 },
            name: { type: "Identifier", value: "p", span: { start: 52, end: 53, ctxt: 1 }, optional: false },
          },
          children: [],
        },
      ],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { getNestedJSXElements } = vi.mocked(await import("@ast/jsx"));

    isJSXElement.mockReturnValue(true);
    getSpan.mockImplementation((node) => (node as { span: { start: number; end: number; ctxt: number } }).span);
    getNestedJSXElements.mockReturnValue([]);

    const result = findSiblingIndexBySpan(mockParent, 35);

    expect(result).toBe(1);
    expect(isJSXElement).toHaveBeenCalledTimes(2);
    expect(getSpan).toHaveBeenCalledTimes(2);
  });

  it("should find nested JSX element by span", async () => {
    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 100, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 95, end: 100, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 97, end: 100, ctxt: 1 }, optional: false },
      },
      children: [
        {
          type: "JSXExpressionContainer",
          span: { start: 10, end: 50, ctxt: 0 },
          expression: {
            type: "ConditionalExpression",
            span: { start: 11, end: 49, ctxt: 0 },
            test: { type: "Identifier", value: "condition", span: { start: 11, end: 20, ctxt: 1 }, optional: false },
            consequent: {
              type: "JSXElement",
              span: { start: 23, end: 35, ctxt: 0 },
              opening: {
                type: "JSXOpeningElement",
                span: { start: 23, end: 28, ctxt: 0 },
                name: { type: "Identifier", value: "span", span: { start: 24, end: 28, ctxt: 1 }, optional: false },
                attributes: [],
                selfClosing: false,
              },
              closing: {
                type: "JSXClosingElement",
                span: { start: 30, end: 35, ctxt: 0 },
                name: { type: "Identifier", value: "span", span: { start: 32, end: 36, ctxt: 1 }, optional: false },
              },
              children: [],
            },
            alternate: { type: "NullLiteral", span: { start: 38, end: 42, ctxt: 0 } },
          },
        },
      ],
    };

    const mockNestedElement = {
      type: "JSXElement" as const,
      span: { start: 23, end: 35, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 23, end: 28, ctxt: 0 },
        name: { type: "Identifier" as const, value: "span", span: { start: 24, end: 28, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement" as const,
        span: { start: 30, end: 35, ctxt: 0 },
        name: { type: "Identifier" as const, value: "span", span: { start: 32, end: 36, ctxt: 1 }, optional: false },
      },
      children: [],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { getNestedJSXElements } = vi.mocked(await import("@ast/jsx"));

    isJSXElement.mockReturnValue(false);
    getSpan.mockImplementation((node) => (node as { span: { start: number; end: number; ctxt: number } }).span);
    getNestedJSXElements.mockReturnValue([mockNestedElement]);

    const result = findSiblingIndexBySpan(mockParent, 23);

    expect(result).toBe(0);
    expect(getNestedJSXElements).toHaveBeenCalledWith(mockParent.children[0]);
  });

  it("should return -1 when span is not found", async () => {
    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 100, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 95, end: 100, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 97, end: 100, ctxt: 1 }, optional: false },
      },
      children: [
        {
          type: "JSXElement",
          span: { start: 10, end: 30, ctxt: 0 },
          opening: {
            type: "JSXOpeningElement",
            span: { start: 10, end: 15, ctxt: 0 },
            name: { type: "Identifier", value: "span", span: { start: 11, end: 15, ctxt: 1 }, optional: false },
            attributes: [],
            selfClosing: false,
          },
          closing: {
            type: "JSXClosingElement",
            span: { start: 25, end: 30, ctxt: 0 },
            name: { type: "Identifier", value: "span", span: { start: 27, end: 31, ctxt: 1 }, optional: false },
          },
          children: [],
        },
      ],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { getNestedJSXElements } = vi.mocked(await import("@ast/jsx"));

    isJSXElement.mockReturnValue(true);
    getSpan.mockImplementation((node) => (node as { span: { start: number; end: number; ctxt: number } }).span);
    getNestedJSXElements.mockReturnValue([]);

    const result = findSiblingIndexBySpan(mockParent, 999);

    expect(result).toBe(-1);
  });

  it("should handle parent with no children", async () => {
    const mockParent: JSXElement = {
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

    const result = findSiblingIndexBySpan(mockParent, 10);

    expect(result).toBe(-1);
  });

  it("should handle mixed JSX elements and non-JSX children", async () => {
    const mockParent: JSXElement = {
      type: "JSXElement",
      span: { start: 0, end: 100, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 5, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 95, end: 100, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 97, end: 100, ctxt: 1 }, optional: false },
      },
      children: [
        {
          type: "JSXText",
          span: { start: 5, end: 10, ctxt: 0 },
          value: "Text",
          raw: "Text",
        },
        {
          type: "JSXElement",
          span: { start: 10, end: 30, ctxt: 0 },
          opening: {
            type: "JSXOpeningElement",
            span: { start: 10, end: 15, ctxt: 0 },
            name: { type: "Identifier", value: "span", span: { start: 11, end: 15, ctxt: 1 }, optional: false },
            attributes: [],
            selfClosing: false,
          },
          closing: {
            type: "JSXClosingElement",
            span: { start: 25, end: 30, ctxt: 0 },
            name: { type: "Identifier", value: "span", span: { start: 27, end: 31, ctxt: 1 }, optional: false },
          },
          children: [],
        },
      ],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { getNestedJSXElements } = vi.mocked(await import("@ast/jsx"));

    isJSXElement.mockImplementation((child) => (child as { type: string }).type === "JSXElement");
    getSpan.mockImplementation((node) => (node as { span: { start: number; end: number; ctxt: number } }).span);
    getNestedJSXElements.mockReturnValue([]);

    const result = findSiblingIndexBySpan(mockParent, 10);

    expect(result).toBe(1);
  });
});
