import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateJSXChildren } from "./updateJSXChildren";

// Mock dependencies
vi.mock("@ast/core/create/createSpan", () => ({
  createSpan: vi.fn(),
}));

vi.mock("@ast/core/get/getSpan", () => ({
  getSpan: vi.fn(),
}));

vi.mock("@ast/identifier/create/createIdentifier", () => ({
  createIdentifier: vi.fn(),
}));

vi.mock("@ast/type-check", () => ({
  isJSXText: vi.fn(),
}));

vi.mock("@ast/utils", () => ({
  transformASTOrNull: vi.fn(),
}));

vi.mock("../create/createJSXText", () => ({
  createJSXText: vi.fn(),
}));

describe("updateJSXChildren", () => {
  let mockAST: Module;

  beforeEach(() => {
    vi.resetAllMocks();

    mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [],
      interpreter: null,
    } as unknown as Module;
  });

  it("should update existing text content in JSX element", async () => {
    const mockJSXElement = {
      type: "JSXElement",
      span: { start: 10, end: 50, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 10, end: 15, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 11, end: 14, ctxt: 1 }, optional: false },
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
          span: { start: 15, end: 45, ctxt: 0 },
          value: "Old content",
          raw: "Old content",
        },
      ],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXText } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXText.mockImplementation(
      (node: unknown) =>
        (node as { type: string; value?: string }).type === "JSXText" &&
        (node as { value?: string }).value?.trim() !== ""
    );
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockJSXElement);
      return result ? { ...ast } : null;
    });

    const result = updateJSXChildren(mockAST, 10, "New content");

    expect(result).not.toBeNull();
    expect(mockJSXElement.children[0].value).toBe("New content");
    expect(mockJSXElement.children[0].raw).toBe("New content");
    expect(mockJSXElement.opening.selfClosing).toBe(false);
  });

  it("should create new text node when no existing text content", async () => {
    const mockJSXElement = {
      type: "JSXElement",
      span: { start: 10, end: 50, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 10, end: 15, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 11, end: 14, ctxt: 1 }, optional: false },
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
          span: { start: 15, end: 20, ctxt: 0 },
          value: "\n    ",
          raw: "\n    ",
        },
      ],
    };

    const mockNewTextNode = {
      type: "JSXText" as const,
      span: { start: 0, end: 11, ctxt: 0 },
      value: "New content",
      raw: "New content",
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXText } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
    const { createJSXText } = vi.mocked(await import("../create/createJSXText"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXText.mockImplementation(
      (node: unknown) =>
        (node as { type: string; value?: string }).type === "JSXText" &&
        (node as { value?: string }).value?.trim() !== ""
    );
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockJSXElement);
      return result ? { ...ast } : null;
    });
    createJSXText.mockReturnValue(mockNewTextNode);

    const result = updateJSXChildren(mockAST, 10, "New content");

    expect(result).not.toBeNull();
    expect(createJSXText).toHaveBeenCalledWith("New content");
    expect(mockJSXElement.children).toEqual([mockNewTextNode]);
  });

  it("should make element self-closing when content is null", async () => {
    const mockJSXElement = {
      type: "JSXElement",
      span: { start: 10, end: 50, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 10, end: 15, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 11, end: 14, ctxt: 1 }, optional: false },
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
          span: { start: 15, end: 45, ctxt: 0 },
          value: "Some content",
          raw: "Some content",
        },
      ],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockJSXElement);
      return result ? { ...ast } : null;
    });

    const result = updateJSXChildren(mockAST, 10, null);

    expect(result).not.toBeNull();
    expect(mockJSXElement.children).toEqual([]);
    expect(mockJSXElement.opening.selfClosing).toBe(true);
    expect((mockJSXElement as { closing: unknown }).closing).toBeNull();
  });

  it("should make element self-closing when content is empty string", async () => {
    const mockJSXElement = {
      type: "JSXElement",
      span: { start: 10, end: 50, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 10, end: 15, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 11, end: 14, ctxt: 1 }, optional: false },
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
          span: { start: 15, end: 45, ctxt: 0 },
          value: "Some content",
          raw: "Some content",
        },
      ],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockJSXElement);
      return result ? { ...ast } : null;
    });

    const result = updateJSXChildren(mockAST, 10, "");

    expect(result).not.toBeNull();
    expect(mockJSXElement.children).toEqual([]);
    expect(mockJSXElement.opening.selfClosing).toBe(true);
    expect((mockJSXElement as { closing: unknown }).closing).toBeNull();
  });

  it("should create closing tag when element doesn't have one", async () => {
    const mockJSXElement = {
      type: "JSXElement",
      span: { start: 10, end: 20, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 10, end: 20, ctxt: 0 },
        name: { type: "Identifier", value: "input", span: { start: 11, end: 16, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: true,
      },
      closing: null,
      children: [],
    };

    const mockNewTextNode = {
      type: "JSXText" as const,
      span: { start: 0, end: 11, ctxt: 0 },
      value: "New content",
      raw: "New content",
    };

    const mockSpan = { start: 0, end: 10, ctxt: 0 };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "input",
      span: mockSpan,
      optional: false,
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXText } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
    const { createJSXText } = vi.mocked(await import("../create/createJSXText"));
    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXText.mockReturnValue(false);
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockJSXElement);
      return result ? { ...ast } : null;
    });
    createJSXText.mockReturnValue(mockNewTextNode);
    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValue(mockIdentifier);

    const result = updateJSXChildren(mockAST, 10, "New content");

    expect(result).not.toBeNull();
    expect(mockJSXElement.opening.selfClosing).toBe(false);
    expect((mockJSXElement as { closing: unknown }).closing).toEqual({
      type: "JSXClosingElement",
      span: mockSpan,
      name: mockIdentifier,
    });
    expect(createIdentifier).toHaveBeenCalledWith("input", 1);
  });

  it("should return null when element span doesn't match", async () => {
    const mockJSXElement = {
      type: "JSXElement",
      span: { start: 999, end: 1050, ctxt: 0 }, // Different span
      opening: {
        type: "JSXOpeningElement",
        span: { start: 999, end: 1005, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1000, end: 1003, ctxt: 1 }, optional: false },
        attributes: [],
        selfClosing: false,
      },
      closing: {
        type: "JSXClosingElement",
        span: { start: 1045, end: 1050, ctxt: 0 },
        name: { type: "Identifier", value: "div", span: { start: 1047, end: 1050, ctxt: 1 }, optional: false },
      },
      children: [],
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockJSXElement);
      return result ? { ...ast } : null;
    });

    const result = updateJSXChildren(mockAST, 10, "New content");

    expect(result).toBeNull();
  });

  it("should handle element with non-Identifier name when creating closing tag", async () => {
    const mockJSXElement = {
      type: "JSXElement",
      span: { start: 10, end: 20, ctxt: 0 },
      opening: {
        type: "JSXOpeningElement",
        span: { start: 10, end: 20, ctxt: 0 },
        name: {
          type: "JSXMemberExpression",
          object: { type: "Identifier", value: "React" },
          property: { type: "Identifier", value: "Fragment" },
        },
        attributes: [],
        selfClosing: true,
      },
      closing: null,
      children: [],
    };

    const mockNewTextNode = {
      type: "JSXText" as const,
      span: { start: 0, end: 11, ctxt: 0 },
      value: "New content",
      raw: "New content",
    };

    const mockSpan = { start: 0, end: 10, ctxt: 0 };
    const mockIdentifier = {
      type: "Identifier" as const,
      value: "div",
      span: mockSpan,
      optional: false,
    };

    const { getSpan } = vi.mocked(await import("@ast/core/get/getSpan"));
    const { isJSXText } = vi.mocked(await import("@ast/type-check"));
    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
    const { createJSXText } = vi.mocked(await import("../create/createJSXText"));
    const { createSpan } = vi.mocked(await import("@ast/core/create/createSpan"));
    const { createIdentifier } = vi.mocked(await import("@ast/identifier/create/createIdentifier"));

    getSpan.mockImplementation(
      (node: unknown) => (node as { span: { start: number; end: number; ctxt: number } }).span
    );
    isJSXText.mockReturnValue(false);
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.JSXElement as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockJSXElement);
      return result ? { ...ast } : null;
    });
    createJSXText.mockReturnValue(mockNewTextNode);
    createSpan.mockReturnValue(mockSpan);
    createIdentifier.mockReturnValue(mockIdentifier);

    const result = updateJSXChildren(mockAST, 10, "New content");

    expect(result).not.toBeNull();
    expect(createIdentifier).toHaveBeenCalledWith("div", 1); // Falls back to "div"
  });
});
