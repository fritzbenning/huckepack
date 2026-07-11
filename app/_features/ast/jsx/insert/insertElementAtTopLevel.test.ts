import type { JSXElement, Module, ReturnStatement } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { insertElementAtTopLevel } from "./insertElementAtTopLevel";

// Mock dependencies
vi.mock("@ast/core/get/getSpan", () => ({
  getSpan: vi.fn(),
}));

vi.mock("@ast/type-check", () => ({
  isParenthesisExpression: vi.fn(),
}));

vi.mock("@ast/utils", () => ({
  createTransformedAST: vi.fn(),
}));

vi.mock("swc-walk", () => ({
  simple: vi.fn(),
}));

vi.mock("../create/createJSXExpressionContainer", () => ({
  createJSXExpressionContainer: vi.fn(),
}));

vi.mock("../create/createJSXFragment", () => ({
  createJSXFragment: vi.fn(),
}));

vi.mock("../create/createJSXText", () => ({
  createJSXText: vi.fn(),
}));

describe("insertElementAtTopLevel", () => {
  let mockAST: Module;
  let mockReturnStatement: ReturnStatement;
  let mockNewElement: JSXElement;

  beforeEach(() => {
    vi.resetAllMocks();

    mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [],
      interpreter: null,
    } as unknown as Module;

    mockReturnStatement = {
      type: "ReturnStatement",
      span: { start: 10, end: 50, ctxt: 0 },
      argument: {
        type: "JSXElement",
        span: { start: 17, end: 45, ctxt: 0 },
        opening: {
          type: "JSXOpeningElement",
          span: { start: 17, end: 22, ctxt: 0 },
          name: { type: "Identifier", value: "div", span: { start: 18, end: 21, ctxt: 1 }, optional: false },
          attributes: [],
          selfClosing: false,
        },
        closing: {
          type: "JSXClosingElement",
          span: { start: 40, end: 45, ctxt: 0 },
          name: { type: "Identifier", value: "div", span: { start: 42, end: 45, ctxt: 1 }, optional: false },
        },
        children: [],
      },
    };

    mockNewElement = {
      type: "JSXElement",
      span: { start: 0, end: 15, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 0, end: 6, ctxt: 0 },
        name: { type: "Identifier", value: "span", span: { start: 1, end: 5, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 9, end: 15, ctxt: 0 },
        name: { type: "Identifier", value: "span", span: { start: 11, end: 15, ctxt: 1 }, optional: false },
      },
      children: [],
    };
  });

  it("should wrap JSXElement in fragment with new element", async () => {
    const mockTransformedAST = { ...mockAST };
    const mockFragment = {
      type: "JSXFragment" as const,
      span: { start: 0, end: 100, ctxt: 0 },
      opening: { type: "JSXOpeningFragment" as const, span: { start: 0, end: 2, ctxt: 0 } },
      closing: { type: "JSXClosingFragment" as const, span: { start: 98, end: 100, ctxt: 0 } },
      children: [],
    };
    const mockTextNode = {
      type: "JSXText" as const,
      span: { start: 0, end: 5, ctxt: 0 },
      value: "\n    ",
      raw: "\n    ",
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isParenthesisExpression } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));
    const { createJSXFragment } = vi.mocked(await import("../create/createJSXFragment"));
    const { createJSXText } = vi.mocked(await import("../create/createJSXText"));

    getSpan.mockReturnValue({ start: 10, end: 50, ctxt: 0 });
    isParenthesisExpression.mockReturnValue(false);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    createJSXFragment.mockReturnValue(mockFragment);
    createJSXText.mockReturnValue(mockTextNode);

    simple.mockImplementation((_ast, visitors) => {
      const mockNode = {
        ...mockReturnStatement,
        argument: {
          ...mockReturnStatement.argument,
          type: "JSXElement" as const,
        },
      };
      (visitors.ReturnStatement as ((node: unknown) => void) | undefined)?.(mockNode);
    });

    const result = insertElementAtTopLevel(mockAST, mockReturnStatement, mockNewElement);

    expect(result).toBe(mockTransformedAST);
    expect(createTransformedAST).toHaveBeenCalledWith(mockAST);
    expect(simple).toHaveBeenCalledWith(mockTransformedAST, expect.any(Object));
    expect(createJSXFragment).toHaveBeenCalled();
  });

  it("should add element to existing JSXFragment", async () => {
    const mockFragmentReturn = {
      ...mockReturnStatement,
      argument: {
        type: "JSXFragment",
        span: { start: 17, end: 45, ctxt: 0 },
        opening: { type: "JSXOpeningFragment", span: { start: 17, end: 19, ctxt: 0 } },
        closing: { type: "JSXClosingFragment", span: { start: 43, end: 45, ctxt: 0 } },
        children: [
          {
            type: "JSXElement",
            span: { start: 19, end: 35, ctxt: 0 },
          },
        ],
      },
    };

    const mockTransformedAST = { ...mockAST };
    const mockTextNode = {
      type: "JSXText" as const,
      span: { start: 0, end: 5, ctxt: 0 },
      value: "\n    ",
      raw: "\n    ",
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isParenthesisExpression } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));
    const { createJSXText } = vi.mocked(await import("../create/createJSXText"));

    getSpan.mockReturnValue({ start: 10, end: 50, ctxt: 0 });
    isParenthesisExpression.mockReturnValue(false);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    createJSXText.mockReturnValue(mockTextNode);

    simple.mockImplementation((_ast, visitors) => {
      const mockNode = {
        ...mockFragmentReturn,
      };
      (visitors.ReturnStatement as ((node: unknown) => void) | undefined)?.(mockNode);
    });

    const result = insertElementAtTopLevel(mockAST, mockReturnStatement, mockNewElement);

    expect(result).toBe(mockTransformedAST);
    expect(createJSXText).toHaveBeenCalledWith("\n    ");
    expect(createJSXText).toHaveBeenCalledWith("\n  ");
  });

  it("should handle ParenthesisExpression wrapper", async () => {
    const mockParenthesisReturn = {
      ...mockReturnStatement,
      argument: {
        type: "ParenthesisExpression",
        span: { start: 16, end: 46, ctxt: 0 },
        expression: {
          type: "JSXElement",
          span: { start: 17, end: 45, ctxt: 0 },
        },
      },
    };

    const mockTransformedAST = { ...mockAST };
    const mockFragment = {
      type: "JSXFragment" as const,
      span: { start: 0, end: 100, ctxt: 0 },
      opening: { type: "JSXOpeningFragment" as const, span: { start: 0, end: 2, ctxt: 0 } },
      closing: { type: "JSXClosingFragment" as const, span: { start: 98, end: 100, ctxt: 0 } },
      children: [],
    };
    const mockTextNode = {
      type: "JSXText" as const,
      span: { start: 0, end: 5, ctxt: 0 },
      value: "\n    ",
      raw: "\n    ",
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isParenthesisExpression } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));
    const { createJSXFragment } = vi.mocked(await import("../create/createJSXFragment"));
    const { createJSXText } = vi.mocked(await import("../create/createJSXText"));

    getSpan.mockReturnValue({ start: 10, end: 50, ctxt: 0 });
    isParenthesisExpression.mockImplementation((expr) => (expr as { type: string }).type === "ParenthesisExpression");
    createTransformedAST.mockReturnValue(mockTransformedAST);
    createJSXFragment.mockReturnValue(mockFragment);
    createJSXText.mockReturnValue(mockTextNode);

    simple.mockImplementation((_ast, visitors) => {
      const mockNode = {
        ...mockParenthesisReturn,
      };
      (visitors.ReturnStatement as ((node: unknown) => void) | undefined)?.(mockNode);
    });

    const result = insertElementAtTopLevel(mockAST, mockReturnStatement, mockNewElement);

    expect(result).toBe(mockTransformedAST);
    expect(createJSXFragment).toHaveBeenCalled();
  });

  it("should wrap other expression types in fragment", async () => {
    const mockOtherReturn = {
      ...mockReturnStatement,
      argument: {
        type: "CallExpression" as const,
        span: { start: 17, end: 45, ctxt: 0 },
        callee: {
          type: "Identifier" as const,
          value: "someFunction",
          span: { start: 17, end: 29, ctxt: 1 },
          optional: false,
        },
        arguments: [],
      },
    };

    const mockTransformedAST = { ...mockAST };
    const mockFragment = {
      type: "JSXFragment" as const,
      span: { start: 0, end: 100, ctxt: 0 },
      opening: { type: "JSXOpeningFragment" as const, span: { start: 0, end: 2, ctxt: 0 } },
      closing: { type: "JSXClosingFragment" as const, span: { start: 98, end: 100, ctxt: 0 } },
      children: [],
    };
    const mockTextNode = {
      type: "JSXText" as const,
      span: { start: 0, end: 5, ctxt: 0 },
      value: "\n    ",
      raw: "\n    ",
    };
    const mockExpressionContainer = {
      type: "JSXExpressionContainer" as const,
      span: { start: 0, end: 30, ctxt: 0 },
      expression: mockOtherReturn.argument,
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isParenthesisExpression } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));
    const { createJSXFragment } = vi.mocked(await import("../create/createJSXFragment"));
    const { createJSXText } = vi.mocked(await import("../create/createJSXText"));
    const { createJSXExpressionContainer } = vi.mocked(await import("../create/createJSXExpressionContainer"));

    getSpan.mockReturnValue({ start: 10, end: 50, ctxt: 0 });
    isParenthesisExpression.mockReturnValue(false);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    createJSXFragment.mockReturnValue(mockFragment);
    createJSXText.mockReturnValue(mockTextNode);
    createJSXExpressionContainer.mockReturnValue(mockExpressionContainer);

    simple.mockImplementation((_ast, visitors) => {
      const mockNode = {
        ...mockOtherReturn,
      };
      (visitors.ReturnStatement as ((node: unknown) => void) | undefined)?.(mockNode);
    });

    const result = insertElementAtTopLevel(mockAST, mockReturnStatement, mockNewElement);

    expect(result).toBe(mockTransformedAST);
    expect(createJSXExpressionContainer).toHaveBeenCalledWith(mockOtherReturn.argument);
    expect(createJSXFragment).toHaveBeenCalled();
  });

  it("should handle return statement with no argument", async () => {
    const mockEmptyReturn = {
      ...mockReturnStatement,
      argument: null,
    };

    const mockTransformedAST = { ...mockAST };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    getSpan.mockReturnValue({ start: 10, end: 50, ctxt: 0 });
    createTransformedAST.mockReturnValue(mockTransformedAST);

    simple.mockImplementation((_ast, visitors) => {
      const mockNode = {
        ...mockEmptyReturn,
      };
      (visitors.ReturnStatement as ((node: unknown) => void) | undefined)?.(mockNode);
    });

    const result = insertElementAtTopLevel(mockAST, mockReturnStatement, mockNewElement);

    expect(result).toBe(mockTransformedAST);
  });

  it("should not modify return statement with different span", async () => {
    const mockTransformedAST = { ...mockAST };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    getSpan.mockReturnValue({ start: 999, end: 1050, ctxt: 0 }); // Different span
    createTransformedAST.mockReturnValue(mockTransformedAST);

    simple.mockImplementation((_ast, visitors) => {
      const mockNode = {
        ...mockReturnStatement,
      };
      (visitors.ReturnStatement as ((node: unknown) => void) | undefined)?.(mockNode);
    });

    const result = insertElementAtTopLevel(mockAST, mockReturnStatement, mockNewElement);

    expect(result).toBe(mockTransformedAST);
  });
});
