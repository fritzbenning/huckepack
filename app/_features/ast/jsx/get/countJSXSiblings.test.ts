import type { JSXElementChild } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { countJSXSiblings } from "./countJSXSiblings";

// Mock dependencies
vi.mock("@ast/jsx", () => ({
  getNestedJSXElements: vi.fn(),
}));

vi.mock("@ast/type-check", () => ({
  isJSXElement: vi.fn(),
}));

describe("countJSXSiblings", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should count JSX elements before position", async () => {
    const mockChildren: JSXElementChild[] = [
      {
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
      },
      {
        type: "JSXElement",
        span: { start: 20, end: 40, ctxt: 0 },
        opening: {
          type: "JSXOpeningElement",
          span: { start: 20, end: 25, ctxt: 0 },
          name: { type: "Identifier", value: "span", span: { start: 21, end: 25, ctxt: 1 }, optional: false },
          attributes: [],
          selfClosing: false,
        },
        closing: {
          type: "JSXClosingElement",
          span: { start: 35, end: 40, ctxt: 0 },
          name: { type: "Identifier", value: "span", span: { start: 37, end: 41, ctxt: 1 }, optional: false },
        },
        children: [],
      },
      {
        type: "JSXText",
        span: { start: 40, end: 45, ctxt: 0 },
        value: "Text",
        raw: "Text",
      },
    ];

    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { getNestedJSXElements } = vi.mocked(await import("@ast/jsx"));

    isJSXElement.mockImplementation((child) => (child as { type: string }).type === "JSXElement");
    getNestedJSXElements.mockReturnValue([]);

    const result = countJSXSiblings(mockChildren, 2);

    expect(result).toBe(2);
    expect(isJSXElement).toHaveBeenCalledTimes(2);
  });

  it("should count nested JSX elements from non-JSX children", async () => {
    const mockChildren: JSXElementChild[] = [
      {
        type: "JSXExpressionContainer",
        span: { start: 0, end: 20, ctxt: 0 },
        expression: {
          type: "ConditionalExpression",
          span: { start: 1, end: 19, ctxt: 0 },
          test: { type: "Identifier", value: "condition", span: { start: 1, end: 10, ctxt: 1 }, optional: false },
          consequent: {
            type: "JSXElement",
            span: { start: 13, end: 18, ctxt: 0 },
            opening: {
              type: "JSXOpeningElement",
              span: { start: 13, end: 18, ctxt: 0 },
              name: { type: "Identifier", value: "div", span: { start: 14, end: 17, ctxt: 1 }, optional: false },
              attributes: [],
              selfClosing: true,
            },
            closing: undefined,
            children: [],
          },
          alternate: { type: "NullLiteral", span: { start: 21, end: 25, ctxt: 0 } },
        },
      },
    ];

    const mockNestedElement = {
      type: "JSXElement" as const,
      span: { start: 13, end: 18, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement" as const,
        span: { start: 13, end: 18, ctxt: 0 },
        name: { type: "Identifier" as const, value: "div", span: { start: 14, end: 17, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: true,
      },
      closing: undefined,
      children: [],
    };

    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { getNestedJSXElements } = vi.mocked(await import("@ast/jsx"));

    isJSXElement.mockReturnValue(false);
    getNestedJSXElements.mockReturnValue([mockNestedElement]);

    const result = countJSXSiblings(mockChildren, 1);

    expect(result).toBe(1);
    expect(getNestedJSXElements).toHaveBeenCalledWith(mockChildren[0]);
  });

  it("should return 0 when position is 0", async () => {
    const mockChildren: JSXElementChild[] = [
      {
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
      },
    ];

    const result = countJSXSiblings(mockChildren, 0);

    expect(result).toBe(0);
  });

  it("should handle empty children array", async () => {
    const mockChildren: JSXElementChild[] = [];

    const result = countJSXSiblings(mockChildren, 0);

    expect(result).toBe(0);
  });

  it("should handle mixed JSX elements and nested elements", async () => {
    const mockChildren: JSXElementChild[] = [
      {
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
      },
      {
        type: "JSXFragment",
        span: { start: 20, end: 40, ctxt: 0 },
        opening: { type: "JSXOpeningFragment", span: { start: 20, end: 22, ctxt: 0 } },
        closing: { type: "JSXClosingFragment", span: { start: 38, end: 40, ctxt: 0 } },
        children: [],
      },
    ];

    const mockNestedElements = [
      {
        type: "JSXElement" as const,
        span: { start: 22, end: 35, ctxt: 0 },
        opening: {
          type: "JSXOpeningElement" as const,
          span: { start: 22, end: 27, ctxt: 0 },
          name: { type: "Identifier" as const, value: "span", span: { start: 23, end: 27, ctxt: 1 }, optional: false },
          attributes: [],
          selfClosing: false,
        },
        closing: {
          type: "JSXClosingElement" as const,
          span: { start: 30, end: 35, ctxt: 0 },
          name: { type: "Identifier" as const, value: "span", span: { start: 32, end: 36, ctxt: 1 }, optional: false },
        },
        children: [],
      },
    ];

    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { getNestedJSXElements } = vi.mocked(await import("@ast/jsx"));

    isJSXElement.mockImplementation((child) => (child as { type: string }).type === "JSXElement");
    getNestedJSXElements.mockImplementation((child) =>
      (child as { type: string }).type === "JSXFragment" ? mockNestedElements : []
    );

    const result = countJSXSiblings(mockChildren, 2);

    expect(result).toBe(2); // 1 JSX element + 1 nested element from fragment
  });
});
