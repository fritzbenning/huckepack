import type { JSXElement } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getJSXElementFromExpression } from "./getJSXElementFromExpression";

// Mock dependencies
vi.mock("@ast/type-check", () => ({
  isArrayExpression: vi.fn(),
  isBlockStatement: vi.fn(),
  isCallExpression: vi.fn(),
  isJSXElement: vi.fn(),
  isJSXFragment: vi.fn(),
  isParenthesisExpression: vi.fn(),
}));

vi.mock("./getJSXElementsFromChild", () => ({
  getJSXElementsFromChild: vi.fn(),
}));

describe("getJSXElementFromExpression", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return empty array for null or undefined", () => {
    expect(getJSXElementFromExpression(null)).toEqual([]);
    expect(getJSXElementFromExpression(undefined)).toEqual([]);
  });

  it("should return empty array for non-object", () => {
    expect(getJSXElementFromExpression("string")).toEqual([]);
    expect(getJSXElementFromExpression(123)).toEqual([]);
    expect(getJSXElementFromExpression(true)).toEqual([]);
  });

  it("should return JSX element when expression is JSXElement", async () => {
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

    const result = getJSXElementFromExpression(mockJSXElement);

    expect(result).toEqual([mockJSXElement]);
    expect(isJSXElement).toHaveBeenCalledWith(mockJSXElement);
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

    const { isJSXElement, isJSXFragment } = vi.mocked(await import("@ast/type-check"));
    const { getJSXElementsFromChild } = vi.mocked(await import("./getJSXElementsFromChild"));

    isJSXElement.mockReturnValue(false);
    isJSXFragment.mockReturnValue(true);
    getJSXElementsFromChild
      .mockReturnValueOnce([mockElements[0] as JSXElement])
      .mockReturnValueOnce([mockElements[1] as JSXElement]);

    const result = getJSXElementFromExpression(mockFragment);

    expect(result).toEqual(mockElements);
    expect(getJSXElementsFromChild).toHaveBeenCalledTimes(2);
  });

  it("should handle parenthesized expressions", async () => {
    const mockInnerElement: JSXElement = {
      type: "JSXElement",
      span: { start: 1, end: 19, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 1, end: 6, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 2, end: 5, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 14, end: 19, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 16, end: 19, ctxt: 1 }, optional: false },
      },
      children: [],
    };

    const mockParenthesisExpr = {
      type: "ParenthesisExpression",
      span: { start: 0, end: 20, ctxt: 0 },
      expression: mockInnerElement,
    };

    const { isJSXElement, isJSXFragment, isParenthesisExpression } = vi.mocked(await import("@ast/type-check"));

    isJSXElement.mockImplementation((expr) => expr === mockInnerElement);
    isJSXFragment.mockReturnValue(false);
    isParenthesisExpression.mockImplementation((expr) => expr === mockParenthesisExpr);

    const result = getJSXElementFromExpression(mockParenthesisExpr);

    expect(result).toEqual([mockInnerElement]);
  });

  it("should handle array expressions", async () => {
    const mockArrayExpr = {
      type: "ArrayExpression",
      span: { start: 0, end: 30, ctxt: 0 },
      elements: [
        { expression: { type: "JSXElement", span: { start: 1, end: 10, ctxt: 0 } } },
        { expression: { type: "JSXElement", span: { start: 12, end: 21, ctxt: 0 } } },
      ],
    };

    const mockElements = [
      { type: "JSXElement", span: { start: 1, end: 10, ctxt: 0 } },
      { type: "JSXElement", span: { start: 12, end: 21, ctxt: 0 } },
    ];

    const { isJSXElement, isJSXFragment, isParenthesisExpression, isArrayExpression } = vi.mocked(
      await import("@ast/type-check")
    );

    isJSXElement.mockImplementation((expr) => mockElements.includes(expr as unknown as (typeof mockElements)[0]));
    isJSXFragment.mockReturnValue(false);
    isParenthesisExpression.mockReturnValue(false);
    isArrayExpression.mockReturnValue(true);

    const result = getJSXElementFromExpression(mockArrayExpr);

    expect(result).toEqual(mockElements);
  });

  it("should handle call expressions with arrow functions", async () => {
    const mockCallExpr = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      arguments: [
        {
          expression: {
            type: "ArrowFunctionExpression",
            body: { type: "JSXElement", span: { start: 20, end: 35, ctxt: 0 } },
          },
        },
      ],
    };

    const mockElement = { type: "JSXElement", span: { start: 20, end: 35, ctxt: 0 } };

    const { isJSXElement, isJSXFragment, isParenthesisExpression, isArrayExpression, isCallExpression } = vi.mocked(
      await import("@ast/type-check")
    );

    isJSXElement.mockImplementation((expr) => expr === mockElement);
    isJSXFragment.mockReturnValue(false);
    isParenthesisExpression.mockReturnValue(false);
    isArrayExpression.mockReturnValue(false);
    isCallExpression.mockReturnValue(true);

    const result = getJSXElementFromExpression(mockCallExpr);

    expect(result).toEqual([mockElement]);
  });

  it("should handle block statements with return statements", async () => {
    const mockBlockStatement = {
      type: "BlockStatement",
      span: { start: 0, end: 40, ctxt: 0 },
      stmts: [
        {
          type: "ReturnStatement",
          span: { start: 2, end: 38, ctxt: 0 },
          argument: { type: "JSXElement", span: { start: 9, end: 35, ctxt: 0 } },
        },
      ],
    };

    const mockElement = { type: "JSXElement", span: { start: 9, end: 35, ctxt: 0 } };

    const {
      isJSXElement,
      isJSXFragment,
      isParenthesisExpression,
      isArrayExpression,
      isCallExpression,
      isBlockStatement,
    } = vi.mocked(await import("@ast/type-check"));

    isJSXElement.mockImplementation((expr) => expr === mockElement);
    isJSXFragment.mockReturnValue(false);
    isParenthesisExpression.mockReturnValue(false);
    isArrayExpression.mockReturnValue(false);
    isCallExpression.mockReturnValue(false);
    isBlockStatement.mockReturnValue(true);

    const result = getJSXElementFromExpression(mockBlockStatement);

    expect(result).toEqual([mockElement]);
  });

  it("should return empty array for unsupported expression types", async () => {
    const mockUnsupportedExpr = {
      type: "UnsupportedExpression",
      span: { start: 0, end: 10, ctxt: 0 },
    };

    const {
      isJSXElement,
      isJSXFragment,
      isParenthesisExpression,
      isArrayExpression,
      isCallExpression,
      isBlockStatement,
    } = vi.mocked(await import("@ast/type-check"));

    isJSXElement.mockReturnValue(false);
    isJSXFragment.mockReturnValue(false);
    isParenthesisExpression.mockReturnValue(false);
    isArrayExpression.mockReturnValue(false);
    isCallExpression.mockReturnValue(false);
    isBlockStatement.mockReturnValue(false);

    const result = getJSXElementFromExpression(mockUnsupportedExpr);

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

    const { isJSXElement, isJSXFragment } = vi.mocked(await import("@ast/type-check"));

    isJSXElement.mockReturnValue(false);
    isJSXFragment.mockReturnValue(true);

    const result = getJSXElementFromExpression(mockFragment);

    expect(result).toEqual([]);
  });
});
