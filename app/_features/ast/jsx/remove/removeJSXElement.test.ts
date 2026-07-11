import type { JSXElement, Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeJSXElement } from "./removeJSXElement";

// Mock dependencies
vi.mock("@ast/core/get/getSpan", () => ({
  getSpan: vi.fn(),
}));

vi.mock("@ast/type-check", () => ({
  isJSXElement: vi.fn(),
  isJSXFragment: vi.fn(),
  isParenthesisExpression: vi.fn(),
}));

vi.mock("@ast/utils", () => ({
  transformASTOrNull: vi.fn(),
}));

describe("removeJSXElement", () => {
  let mockAST: Module;
  let mockNodeToDelete: JSXElement;

  beforeEach(() => {
    vi.resetAllMocks();

    mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [],
      interpreter: null,
    } as unknown as Module;

    mockNodeToDelete = {
      type: "JSXElement",
      span: { start: 20, end: 35, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 20, end: 25, ctxt: 0 },
        name: { type: "Identifier", value: "span", span: { start: 21, end: 25, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 30, end: 35, ctxt: 0 },
        name: { type: "Identifier", value: "span", span: { start: 32, end: 36, ctxt: 1 }, optional: false },
      },
      children: [],
    };
  });

  it("should remove JSX element from parent JSX element children", async () => {
    const mockParentElement = {
      type: "JSXElement",
      span: { start: 0, end: 50, ctxt: 0 },
      children: [
        { type: "JSXText", span: { start: 5, end: 20, ctxt: 0 }, value: "\n    ", raw: "\n    " },
        mockNodeToDelete,
        { type: "JSXText", span: { start: 35, end: 45, ctxt: 0 }, value: "\n  ", raw: "\n  " },
      ],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXElement.mockImplementation((node: unknown) => (node as { type: string }).type === "JSXElement");
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockParentElement);
      return result ? { ...ast } : null;
    });

    const result = removeJSXElement(mockAST, mockNodeToDelete);

    expect(result).not.toBeNull();
    expect(transformASTOrNull).toHaveBeenCalledWith(mockAST, expect.any(Object));
    // The element and surrounding whitespace should be removed
    expect(mockParentElement.children).toHaveLength(0);
  });

  it("should remove JSX element from JSXFragment in return statement", async () => {
    const mockFragment = {
      type: "JSXFragment",
      span: { start: 10, end: 60, ctxt: 0 },
      opening: { type: "JSXOpeningFragment", span: { start: 10, end: 12, ctxt: 0 } },
      closing: { type: "JSXClosingFragment", span: { start: 58, end: 60, ctxt: 0 } },
      children: [
        { type: "JSXText", span: { start: 12, end: 20, ctxt: 0 }, value: "\n    ", raw: "\n    " },
        mockNodeToDelete,
        { type: "JSXText", span: { start: 35, end: 50, ctxt: 0 }, value: "\n  ", raw: "\n  " },
      ],
    };

    const mockReturnStatement = {
      type: "ReturnStatement",
      span: { start: 0, end: 70, ctxt: 0 },
      argument: mockFragment,
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement, isJSXFragment, isParenthesisExpression } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXElement.mockImplementation((node: unknown) => (node as { type: string }).type === "JSXElement");
    isJSXFragment.mockImplementation((node: unknown) => (node as { type: string }).type === "JSXFragment");
    isParenthesisExpression.mockReturnValue(false);
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.ReturnStatement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockReturnStatement);
      return result ? { ...ast } : null;
    });

    const result = removeJSXElement(mockAST, mockNodeToDelete);

    expect(result).not.toBeNull();
    expect(mockFragment.children).toHaveLength(0);
  });

  it("should handle ParenthesisExpression wrapper in return statement", async () => {
    const mockFragment = {
      type: "JSXFragment",
      span: { start: 11, end: 59, ctxt: 0 },
      opening: { type: "JSXOpeningFragment", span: { start: 11, end: 13, ctxt: 0 } },
      closing: { type: "JSXClosingFragment", span: { start: 57, end: 59, ctxt: 0 } },
      children: [mockNodeToDelete],
    };

    const mockParenthesisExpression = {
      type: "ParenthesisExpression",
      span: { start: 10, end: 60, ctxt: 0 },
      expression: mockFragment,
    };

    const mockReturnStatement = {
      type: "ReturnStatement",
      span: { start: 0, end: 70, ctxt: 0 },
      argument: mockParenthesisExpression,
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement, isJSXFragment, isParenthesisExpression } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXElement.mockImplementation((node: unknown) => (node as { type: string }).type === "JSXElement");
    isJSXFragment.mockImplementation((node: unknown) => (node as { type: string }).type === "JSXFragment");
    isParenthesisExpression.mockImplementation(
      (node: unknown) => (node as { type: string }).type === "ParenthesisExpression"
    );
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.ReturnStatement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockReturnStatement);
      return result ? { ...ast } : null;
    });

    const result = removeJSXElement(mockAST, mockNodeToDelete);

    expect(result).not.toBeNull();
    expect(mockFragment.children).toHaveLength(0);
  });

  it("should return null when element is not found", async () => {
    const mockParentElement = {
      type: "JSXElement",
      span: { start: 0, end: 50, ctxt: 0 },
      children: [
        {
          type: "JSXElement",
          span: { start: 999, end: 1010, ctxt: 0 }, // Different span
        },
      ],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXElement.mockImplementation((node: unknown) => (node as { type: string }).type === "JSXElement");
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockParentElement);
      return result ? { ...ast } : null;
    });

    const result = removeJSXElement(mockAST, mockNodeToDelete);

    expect(result).toBeNull();
  });

  it("should not remove JSXElement in return statement if it's the main element", async () => {
    const mockReturnStatement = {
      type: "ReturnStatement",
      span: { start: 0, end: 50, ctxt: 0 },
      argument: mockNodeToDelete,
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement, isJSXFragment, isParenthesisExpression } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXElement.mockImplementation((node: unknown) => (node as { type: string }).type === "JSXElement");
    isJSXFragment.mockReturnValue(false);
    isParenthesisExpression.mockReturnValue(false);
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.ReturnStatement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockReturnStatement);
      return result ? { ...ast } : null;
    });

    const result = removeJSXElement(mockAST, mockNodeToDelete);

    expect(result).toBeNull();
  });

  it("should handle return statement with no argument", async () => {
    const mockReturnStatement = {
      type: "ReturnStatement",
      span: { start: 0, end: 10, ctxt: 0 },
      argument: null,
    };

    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.ReturnStatement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockReturnStatement);
      return result ? { ...ast } : null;
    });

    const result = removeJSXElement(mockAST, mockNodeToDelete);

    expect(result).toBeNull();
  });

  it("should remove element with only preceding whitespace", async () => {
    const mockParentElement = {
      type: "JSXElement",
      span: { start: 0, end: 50, ctxt: 0 },
      children: [
        { type: "JSXText", span: { start: 5, end: 20, ctxt: 0 }, value: "\n    ", raw: "\n    " },
        mockNodeToDelete,
      ],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXElement.mockImplementation((node: unknown) => (node as { type: string }).type === "JSXElement");
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockParentElement);
      return result ? { ...ast } : null;
    });

    const result = removeJSXElement(mockAST, mockNodeToDelete);

    expect(result).not.toBeNull();
    expect(mockParentElement.children).toHaveLength(0);
  });

  it("should remove element with only following whitespace", async () => {
    const mockParentElement = {
      type: "JSXElement",
      span: { start: 0, end: 50, ctxt: 0 },
      children: [
        mockNodeToDelete,
        { type: "JSXText", span: { start: 35, end: 45, ctxt: 0 }, value: "\n  ", raw: "\n  " },
      ],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXElement.mockImplementation((node: unknown) => (node as { type: string }).type === "JSXElement");
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockParentElement);
      return result ? { ...ast } : null;
    });

    const result = removeJSXElement(mockAST, mockNodeToDelete);

    expect(result).not.toBeNull();
    expect(mockParentElement.children).toHaveLength(0);
  });

  it("should not remove non-whitespace text nodes", async () => {
    const mockParentElement = {
      type: "JSXElement",
      span: { start: 0, end: 50, ctxt: 0 },
      children: [
        { type: "JSXText", span: { start: 5, end: 20, ctxt: 0 }, value: "Content", raw: "Content" },
        mockNodeToDelete,
        { type: "JSXText", span: { start: 35, end: 45, ctxt: 0 }, value: "More content", raw: "More content" },
      ],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXElement } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXElement.mockImplementation((node: unknown) => (node as { type: string }).type === "JSXElement");
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockParentElement);
      return result ? { ...ast } : null;
    });

    const result = removeJSXElement(mockAST, mockNodeToDelete);

    expect(result).not.toBeNull();
    // Only the target element should be removed, text content should remain
    expect(mockParentElement.children).toHaveLength(2);
    expect(mockParentElement.children[0].type).toBe("JSXText");
    expect(mockParentElement.children[1].type).toBe("JSXText");
  });
});
