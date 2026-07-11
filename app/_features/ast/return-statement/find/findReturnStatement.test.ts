import type { Module, ReturnStatement } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { findReturnStatement } from "./findReturnStatement";

// Mock dependencies
vi.mock("swc-walk", () => ({
  simple: vi.fn(),
}));

describe("findReturnStatement", () => {
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

  it("should find and return the first ReturnStatement", async () => {
    const mockReturnStatement: ReturnStatement = {
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

    const { simple } = vi.mocked(await import("swc-walk"));
    simple.mockImplementation((_ast, visitors) => {
      (visitors.ReturnStatement as ((node: unknown) => void) | undefined)?.(mockReturnStatement);
    });

    const result = findReturnStatement(mockAST);

    expect(result).toBe(mockReturnStatement);
    expect(simple).toHaveBeenCalledWith(mockAST, expect.any(Object));
  });

  it("should return null when no ReturnStatement is found", async () => {
    const { simple } = vi.mocked(await import("swc-walk"));
    simple.mockImplementation((_ast, _visitors) => {
      // Don't call the ReturnStatement visitor
    });

    const result = findReturnStatement(mockAST);

    expect(result).toBeNull();
    expect(simple).toHaveBeenCalledWith(mockAST, expect.any(Object));
  });

  it("should return the first ReturnStatement when multiple exist", async () => {
    const mockFirstReturn: ReturnStatement = {
      type: "ReturnStatement",
      span: { start: 10, end: 30, ctxt: 0 },
      argument: {
        type: "StringLiteral",
        span: { start: 17, end: 28, ctxt: 0 },
        value: "first",
        raw: '"first"',
      },
    };

    const mockSecondReturn: ReturnStatement = {
      type: "ReturnStatement",
      span: { start: 40, end: 60, ctxt: 0 },
      argument: {
        type: "StringLiteral",
        span: { start: 47, end: 58, ctxt: 0 },
        value: "second",
        raw: '"second"',
      },
    };

    const { simple } = vi.mocked(await import("swc-walk"));
    simple.mockImplementation((_ast, visitors) => {
      const visitorFn = visitors.ReturnStatement as ((node: unknown) => unknown) | undefined;
      if (visitorFn) {
        visitorFn(mockFirstReturn);
        visitorFn(mockSecondReturn);
      }
    });

    const result = findReturnStatement(mockAST);

    expect(result).toBe(mockFirstReturn);
    expect(result).not.toBe(mockSecondReturn);
  });

  it("should handle ReturnStatement with null argument", async () => {
    const mockReturnStatement: ReturnStatement = {
      type: "ReturnStatement",
      span: { start: 10, end: 17, ctxt: 0 },
      argument: undefined,
    };

    const { simple } = vi.mocked(await import("swc-walk"));
    simple.mockImplementation((_ast, visitors) => {
      (visitors.ReturnStatement as ((node: unknown) => void) | undefined)?.(mockReturnStatement);
    });

    const result = findReturnStatement(mockAST);

    expect(result).toBe(mockReturnStatement);
    expect(result?.argument).toBeNull();
  });

  it("should handle ReturnStatement with complex expression", async () => {
    const mockReturnStatement: ReturnStatement = {
      type: "ReturnStatement",
      span: { start: 10, end: 80, ctxt: 0 },
      argument: {
        type: "ConditionalExpression",
        span: { start: 17, end: 75, ctxt: 0 },
        test: {
          type: "Identifier",
          span: { start: 17, end: 26, ctxt: 0 },
          value: "condition",
          optional: false,
        },
        consequent: {
          type: "JSXElement",
          span: { start: 29, end: 45, ctxt: 0 },
          opening: {
            type: "JSXOpeningElement",
            span: { start: 29, end: 34, ctxt: 0 },
            name: { type: "Identifier", value: "div", span: { start: 30, end: 33, ctxt: 1 }, optional: false },
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
        alternate: {
          type: "NullLiteral",
          span: { start: 48, end: 52, ctxt: 0 },
        },
      },
    };

    const { simple } = vi.mocked(await import("swc-walk"));
    simple.mockImplementation((_ast, visitors) => {
      (visitors.ReturnStatement as ((node: unknown) => void) | undefined)?.(mockReturnStatement);
    });

    const result = findReturnStatement(mockAST);

    expect(result).toBe(mockReturnStatement);
    expect(result?.argument?.type).toBe("ConditionalExpression");
  });

  it("should handle empty AST", async () => {
    const emptyAST: Module = {
      type: "Module",
      span: { start: 0, end: 0, ctxt: 0 },
      body: [],
      interpreter: null,
    } as unknown as Module;

    const { simple } = vi.mocked(await import("swc-walk"));
    simple.mockImplementation((_ast, _visitors) => {
      // Empty AST, no nodes to visit
    });

    const result = findReturnStatement(emptyAST);

    expect(result).toBeNull();
  });

  it("should handle AST with other statement types but no return", async () => {
    const { simple } = vi.mocked(await import("swc-walk"));
    simple.mockImplementation((_ast, _visitors) => {
      // Simulate visiting other types of statements but no ReturnStatement
      // The visitor object has ReturnStatement but we don't call it
    });

    const result = findReturnStatement(mockAST);

    expect(result).toBeNull();
  });

  it("should handle ReturnStatement with identifier argument", async () => {
    const mockReturnStatement: ReturnStatement = {
      type: "ReturnStatement",
      span: { start: 10, end: 25, ctxt: 0 },
      argument: {
        type: "Identifier",
        span: { start: 17, end: 24, ctxt: 0 },
        value: "result",
        optional: false,
      },
    };

    const { simple } = vi.mocked(await import("swc-walk"));
    simple.mockImplementation((_ast, visitors) => {
      (visitors.ReturnStatement as ((node: unknown) => void) | undefined)?.(mockReturnStatement);
    });

    const result = findReturnStatement(mockAST);

    expect(result).toBe(mockReturnStatement);
    expect(result?.argument?.type).toBe("Identifier");
  });

  it("should handle ReturnStatement with call expression", async () => {
    const mockReturnStatement: ReturnStatement = {
      type: "ReturnStatement",
      span: { start: 10, end: 35, ctxt: 0 },
      argument: {
        type: "CallExpression",
        span: { start: 17, end: 34, ctxt: 0 },
        callee: {
          type: "Identifier",
          span: { start: 17, end: 25, ctxt: 0 },
          value: "someFunc",
          optional: false,
        },
        arguments: [],
      },
    };

    const { simple } = vi.mocked(await import("swc-walk"));
    simple.mockImplementation((_ast, visitors) => {
      (visitors.ReturnStatement as ((node: unknown) => void) | undefined)?.(mockReturnStatement);
    });

    const result = findReturnStatement(mockAST);

    expect(result).toBe(mockReturnStatement);
    expect(result?.argument?.type).toBe("CallExpression");
  });
});
