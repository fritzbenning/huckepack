import type { JSXElement, JSXElementChild } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getNestedJSXElements } from "./getNestedJSXElements";

// Mock dependencies
vi.mock("@ast/type-check", () => ({
  isBinaryExpression: vi.fn(),
  isConditionalExpression: vi.fn(),
  isJSXElement: vi.fn(),
  isJSXExpressionContainer: vi.fn(),
  isJSXFragment: vi.fn(),
}));

vi.mock("./getJSXElementFromExpression", () => ({
  getJSXElementFromExpression: vi.fn(),
}));

describe("getNestedJSXElements", () => {
  beforeEach(() => {
    vi.resetAllMocks();
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

    const result = getNestedJSXElements(mockJSXElement);

    expect(result).toEqual([mockJSXElement]);
    expect(isJSXElement).toHaveBeenCalledWith(mockJSXElement);
  });

  it("should handle conditional expressions in JSXExpressionContainer", async () => {
    const mockExpressionContainer = {
      type: "JSXExpressionContainer",
      span: { start: 0, end: 40, ctxt: 0 },
      expression: {
        type: "ConditionalExpression",
        span: { start: 1, end: 39, ctxt: 0 },
        test: { type: "Identifier", value: "condition", span: { start: 1, end: 10, ctxt: 1 }, optional: false },
        consequent: { type: "JSXElement", span: { start: 13, end: 25, ctxt: 0 } },
        alternate: { type: "JSXElement", span: { start: 28, end: 38, ctxt: 0 } },
      },
    } as JSXElementChild;

    const mockConsequentElements = [{ type: "JSXElement", span: { start: 13, end: 25, ctxt: 0 } }];
    const mockAlternateElements = [{ type: "JSXElement", span: { start: 28, end: 38, ctxt: 0 } }];

    const { isJSXElement, isJSXExpressionContainer, isConditionalExpression } = vi.mocked(
      await import("@ast/type-check")
    );
    const { getJSXElementFromExpression } = vi.mocked(await import("./getJSXElementFromExpression"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(true);
    isConditionalExpression.mockReturnValue(true);
    getJSXElementFromExpression
      .mockReturnValueOnce(mockConsequentElements as JSXElement[])
      .mockReturnValueOnce(mockAlternateElements as JSXElement[]);

    const result = getNestedJSXElements(mockExpressionContainer);

    expect(result).toEqual([...mockConsequentElements, ...mockAlternateElements]);
    expect(getJSXElementFromExpression).toHaveBeenCalledWith(
      (mockExpressionContainer as { expression: { consequent: unknown; alternate: unknown } }).expression.consequent
    );
    expect(getJSXElementFromExpression).toHaveBeenCalledWith(
      (mockExpressionContainer as { expression: { consequent: unknown; alternate: unknown } }).expression.alternate
    );
  });

  it("should handle binary expressions in JSXExpressionContainer", async () => {
    const mockExpressionContainer = {
      type: "JSXExpressionContainer",
      span: { start: 0, end: 30, ctxt: 0 },
      expression: {
        type: "BinaryExpression",
        span: { start: 1, end: 29, ctxt: 0 },
        operator: "&&",
        left: { type: "Identifier", value: "condition", span: { start: 1, end: 10, ctxt: 1 }, optional: false },
        right: { type: "JSXElement", span: { start: 14, end: 28, ctxt: 0 } },
      },
    } as JSXElementChild;

    const mockLeftElements: JSXElement[] = [];
    const mockRightElements = [{ type: "JSXElement", span: { start: 14, end: 28, ctxt: 0 } }];

    const { isJSXElement, isJSXExpressionContainer, isConditionalExpression, isBinaryExpression } = vi.mocked(
      await import("@ast/type-check")
    );
    const { getJSXElementFromExpression } = vi.mocked(await import("./getJSXElementFromExpression"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(true);
    isConditionalExpression.mockReturnValue(false);
    isBinaryExpression.mockReturnValue(true);
    getJSXElementFromExpression
      .mockReturnValueOnce(mockLeftElements)
      .mockReturnValueOnce(mockRightElements as JSXElement[]);

    const result = getNestedJSXElements(mockExpressionContainer);

    expect(result).toEqual([...mockLeftElements, ...mockRightElements]);
    expect(getJSXElementFromExpression).toHaveBeenCalledWith(
      (mockExpressionContainer as { expression: { left: unknown; right: unknown } }).expression.left
    );
    expect(getJSXElementFromExpression).toHaveBeenCalledWith(
      (mockExpressionContainer as { expression: { left: unknown; right: unknown } }).expression.right
    );
  });

  it("should handle direct JSXElement in JSXExpressionContainer", async () => {
    const mockExpressionContainer = {
      type: "JSXExpressionContainer",
      span: { start: 0, end: 25, ctxt: 0 },
      expression: {
        type: "JSXElement",
        span: { start: 1, end: 24, ctxt: 0 },
      },
    } as JSXElementChild;

    const mockElements = [{ type: "JSXElement", span: { start: 1, end: 24, ctxt: 0 } }];

    const { isJSXElement, isJSXExpressionContainer, isConditionalExpression, isBinaryExpression } = vi.mocked(
      await import("@ast/type-check")
    );
    const { getJSXElementFromExpression } = vi.mocked(await import("./getJSXElementFromExpression"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(true);
    isConditionalExpression.mockReturnValue(false);
    isBinaryExpression.mockReturnValue(false);
    getJSXElementFromExpression.mockReturnValue(mockElements as JSXElement[]);

    const result = getNestedJSXElements(mockExpressionContainer);

    expect(result).toEqual(mockElements);
    expect(getJSXElementFromExpression).toHaveBeenCalledWith(
      (mockExpressionContainer as { expression: unknown }).expression
    );
  });

  it("should handle JSXFragment with nested elements", async () => {
    const mockFragment = {
      type: "JSXFragment",
      span: { start: 0, end: 50, ctxt: 0 },
      opening: { type: "JSXOpeningFragment", span: { start: 0, end: 2, ctxt: 0 } },
      closing: { type: "JSXClosingFragment", span: { start: 48, end: 50, ctxt: 0 } },
      children: [
        { type: "JSXElement", span: { start: 2, end: 20, ctxt: 0 } },
        { type: "JSXElement", span: { start: 20, end: 40, ctxt: 0 } },
      ],
    } as JSXElementChild;

    const mockElements = [
      { type: "JSXElement", span: { start: 2, end: 20, ctxt: 0 } },
      { type: "JSXElement", span: { start: 20, end: 40, ctxt: 0 } },
    ];

    const { isJSXElement, isJSXExpressionContainer, isJSXFragment } = vi.mocked(await import("@ast/type-check"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(false);
    isJSXFragment.mockReturnValue(true);

    // Mock recursive calls
    const originalGetNestedJSXElements = getNestedJSXElements;
    const mockGetNestedJSXElements = vi
      .fn()
      .mockReturnValueOnce([mockElements[0] as JSXElement])
      .mockReturnValueOnce([mockElements[1] as JSXElement]);

    // Replace the function temporarily for recursive calls
    vi.doMock("./getNestedJSXElements", () => ({
      getNestedJSXElements: mockGetNestedJSXElements,
    }));

    const result = originalGetNestedJSXElements(mockFragment);

    expect(result).toEqual(mockElements);
  });

  it("should return empty array for unsupported child types", async () => {
    const mockUnsupportedChild = {
      type: "JSXText",
      span: { start: 0, end: 10, ctxt: 0 },
      value: "Text content",
      raw: "Text content",
    } as JSXElementChild;

    const { isJSXElement, isJSXExpressionContainer, isJSXFragment } = vi.mocked(await import("@ast/type-check"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(false);
    isJSXFragment.mockReturnValue(false);

    const result = getNestedJSXElements(mockUnsupportedChild);

    expect(result).toEqual([]);
  });

  it("should handle JSXFragment with empty children", async () => {
    const mockFragment = {
      type: "JSXFragment",
      span: { start: 0, end: 10, ctxt: 0 },
      opening: { type: "JSXOpeningFragment", span: { start: 0, end: 2, ctxt: 0 } },
      closing: { type: "JSXClosingFragment", span: { start: 8, end: 10, ctxt: 0 } },
      children: [],
    } as JSXElementChild;

    const { isJSXElement, isJSXExpressionContainer, isJSXFragment } = vi.mocked(await import("@ast/type-check"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(false);
    isJSXFragment.mockReturnValue(true);

    const result = getNestedJSXElements(mockFragment);

    expect(result).toEqual([]);
  });

  it("should handle complex nested conditional with multiple elements", async () => {
    const mockExpressionContainer = {
      type: "JSXExpressionContainer",
      span: { start: 0, end: 60, ctxt: 0 },
      expression: {
        type: "ConditionalExpression",
        span: { start: 1, end: 59, ctxt: 0 },
        test: { type: "Identifier", value: "showBoth", span: { start: 1, end: 9, ctxt: 1 }, optional: false },
        consequent: {
          type: "JSXFragment",
          span: { start: 12, end: 35, ctxt: 0 },
          children: [
            { type: "JSXElement", span: { start: 14, end: 20, ctxt: 0 } },
            { type: "JSXElement", span: { start: 20, end: 33, ctxt: 0 } },
          ],
        },
        alternate: { type: "JSXElement", span: { start: 38, end: 58, ctxt: 0 } },
      },
    } as JSXElementChild;

    const mockConsequentElements = [
      { type: "JSXElement", span: { start: 14, end: 20, ctxt: 0 } },
      { type: "JSXElement", span: { start: 20, end: 33, ctxt: 0 } },
    ];
    const mockAlternateElements = [{ type: "JSXElement", span: { start: 38, end: 58, ctxt: 0 } }];

    const { isJSXElement, isJSXExpressionContainer, isConditionalExpression } = vi.mocked(
      await import("@ast/type-check")
    );
    const { getJSXElementFromExpression } = vi.mocked(await import("./getJSXElementFromExpression"));

    isJSXElement.mockReturnValue(false);
    isJSXExpressionContainer.mockReturnValue(true);
    isConditionalExpression.mockReturnValue(true);
    getJSXElementFromExpression
      .mockReturnValueOnce(mockConsequentElements as JSXElement[])
      .mockReturnValueOnce(mockAlternateElements as JSXElement[]);

    const result = getNestedJSXElements(mockExpressionContainer);

    expect(result).toEqual([...mockConsequentElements, ...mockAlternateElements]);
  });
});
