import type { JSXElement } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getJSXElementsFromChild } from "./getJSXElementsFromChild";

// Mock dependencies
vi.mock("@ast/type-check", () => ({
  isJSXElement: vi.fn(),
  isJSXExpressionContainer: vi.fn(),
  isJSXFragment: vi.fn(),
}));

vi.mock("./getJSXElementFromExpression", () => ({
  getJSXElementFromExpression: vi.fn(),
}));

describe("getJSXElementsFromChild", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return empty array for null or undefined", () => {
    expect(getJSXElementsFromChild(null)).toEqual([]);
    expect(getJSXElementsFromChild(undefined)).toEqual([]);
  });

  it("should return empty array for non-object", () => {
    expect(getJSXElementsFromChild("string")).toEqual([]);
    expect(getJSXElementsFromChild(123)).toEqual([]);
    expect(getJSXElementsFromChild(true)).toEqual([]);
  });

  it("should return JSX element when child is JSXElement", async () => {
    const mockJSXElement: JSXElement = {
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

    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    isJSXElement.mockReturnValue(true);

    const result = getJSXElementsFromChild(mockJSXElement);

    expect(result).toEqual([mockJSXElement]);
    expect(isJSXElement).toHaveBeenCalledWith(mockJSXElement);
  });

  it("should extract elements from JSXExpressionContainer", async () => {
    const mockExpressionContainer = {
      type: "JSXExpressionContainer",
      span: { start: 0, end: 30, ctxt: 0 },
      expression: {
        type: "ConditionalExpression",
        span: { start: 1, end: 29, ctxt: 0 },
        test: { type: "Identifier", value: "condition", span: { start: 1, end: 10, ctxt: 1 }, optional: false },
        consequent: { type: "JSXElement", span: { start: 13, end: 20, ctxt: 0 } },
        alternate: { type: "JSXElement", span: { start: 23, end: 28, ctxt: 0 } },
      },
    };

    const mockElements = [
      { type: "JSXElement", span: { start: 13, end: 20, ctxt: 0 } },
      { type: "JSXElement", span: { start: 23, end: 28, ctxt: 0 } },
    ];

    const { isJSXElement, isJSXExpressionContainer } = vi.mocked(await import("@ast/type-check"));
    const { getJSXElementFromExpression } = vi.mocked(await import("./getJSXElementFromExpression"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(true);
    getJSXElementFromExpression.mockReturnValue(mockElements as JSXElement[]);

    const result = getJSXElementsFromChild(mockExpressionContainer);

    expect(result).toEqual(mockElements);
    expect(getJSXElementFromExpression).toHaveBeenCalledWith(mockExpressionContainer.expression);
  });

  it("should extract elements from JSXFragment children", async () => {
    const mockFragment = {
      type: "JSXFragment",
      span: { start: 0, end: 50, ctxt: 0 },
      opening: { type: "JSXOpeningFragment", span: { start: 0, end: 2, ctxt: 0 } },
      closing: { type: "JSXClosingFragment", span: { start: 48, end: 50, ctxt: 0 } },
      children: [
        { type: "JSXElement", span: { start: 2, end: 20, ctxt: 0 } },
        { type: "JSXElement", span: { start: 20, end: 40, ctxt: 0 } },
      ],
    };

    const mockElements = [
      { type: "JSXElement", span: { start: 2, end: 20, ctxt: 0 } },
      { type: "JSXElement", span: { start: 20, end: 40, ctxt: 0 } },
    ];

    const { isJSXElement, isJSXExpressionContainer, isJSXFragment } = vi.mocked(await import("@ast/type-check"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(false);
    isJSXFragment.mockReturnValue(true);

    // Mock recursive calls
    const originalGetJSXElementsFromChild = getJSXElementsFromChild;
    const mockGetJSXElementsFromChild = vi.fn()
      .mockReturnValueOnce([mockElements[0] as JSXElement])
      .mockReturnValueOnce([mockElements[1] as JSXElement]);

    // Replace the function temporarily for recursive calls
    vi.doMock("./getJSXElementsFromChild", () => ({
      getJSXElementsFromChild: mockGetJSXElementsFromChild,
    }));

    const result = originalGetJSXElementsFromChild(mockFragment);

    expect(result).toEqual(mockElements);
  });

  it("should return empty array for unsupported child types", async () => {
    const mockUnsupportedChild = {
      type: "JSXText",
      span: { start: 0, end: 10, ctxt: 0 },
      value: "Text content",
      raw: "Text content",
    };

    const { isJSXElement, isJSXExpressionContainer, isJSXFragment } = vi.mocked(await import("@ast/type-check"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(false);
    isJSXFragment.mockReturnValue(false);

    const result = getJSXElementsFromChild(mockUnsupportedChild);

    expect(result).toEqual([]);
  });

  it("should handle JSXFragment with no children", async () => {
    const mockFragment = {
      type: "JSXFragment",
      span: { start: 0, end: 10, ctxt: 0 },
      opening: { type: "JSXOpeningFragment", span: { start: 0, end: 2, ctxt: 0 } },
      closing: { type: "JSXClosingFragment", span: { start: 8, end: 10, ctxt: 0 } },
      children: null,
    };

    const { isJSXElement, isJSXExpressionContainer, isJSXFragment } = vi.mocked(await import("@ast/type-check"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(false);
    isJSXFragment.mockReturnValue(true);

    const result = getJSXElementsFromChild(mockFragment);

    expect(result).toEqual([]);
  });

  it("should handle JSXFragment with empty children array", async () => {
    const mockFragment = {
      type: "JSXFragment",
      span: { start: 0, end: 10, ctxt: 0 },
      opening: { type: "JSXOpeningFragment", span: { start: 0, end: 2, ctxt: 0 } },
      closing: { type: "JSXClosingFragment", span: { start: 8, end: 10, ctxt: 0 } },
      children: [],
    };

    const { isJSXElement, isJSXExpressionContainer, isJSXFragment } = vi.mocked(await import("@ast/type-check"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(false);
    isJSXFragment.mockReturnValue(true);

    const result = getJSXElementsFromChild(mockFragment);

    expect(result).toEqual([]);
  });

  it("should handle complex nested JSXExpressionContainer", async () => {
    const mockExpressionContainer = {
      type: "JSXExpressionContainer",
      span: { start: 0, end: 40, ctxt: 0 },
      expression: {
        type: "CallExpression",
        span: { start: 1, end: 39, ctxt: 0 },
        callee: { type: "Identifier", value: "items.map", span: { start: 1, end: 10, ctxt: 1 }, optional: false },
        arguments: [
          {
            type: "ArrowFunctionExpression",
            span: { start: 11, end: 38, ctxt: 0 },
            body: { type: "JSXElement", span: { start: 20, end: 35, ctxt: 0 } },
          },
        ],
      },
    };

    const mockElements = [
      { type: "JSXElement", span: { start: 20, end: 35, ctxt: 0 } },
    ];

    const { isJSXElement, isJSXExpressionContainer } = vi.mocked(await import("@ast/type-check"));
    const { getJSXElementFromExpression } = vi.mocked(await import("./getJSXElementFromExpression"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(true);
    getJSXElementFromExpression.mockReturnValue(mockElements as JSXElement[]);

    const result = getJSXElementsFromChild(mockExpressionContainer);

    expect(result).toEqual(mockElements);
    expect(getJSXElementFromExpression).toHaveBeenCalledWith(mockExpressionContainer.expression);
  });
});