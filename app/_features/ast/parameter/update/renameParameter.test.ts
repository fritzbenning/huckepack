import type { FunctionDeclaration, FunctionExpression, Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renameParameter } from "./renameParameter";

vi.mock("@ast/utils", () => ({
  traverseExports: vi.fn(),
}));

vi.mock("../utils", () => ({
  findParameterByName: vi.fn(),
  getObjectPatternFromDeclaration: vi.fn(),
}));

describe("renameParameter", () => {
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

  it("should rename parameter successfully", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "oldName",
        span: { start: 25, end: 32, ctxt: 1 },
        optional: false,
      },
      value: undefined,
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [mockParam],
      optional: false,
    };

    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        optional: false,
      },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 20, end: 50, ctxt: 0 },
          decorators: [],
          pat: mockPattern,
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 51, end: 80, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const mockTransformedAST = { ...mockAST };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParam);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });

    const result = renameParameter(mockAST, "oldName", "newName");

    expect(result).toBe(mockTransformedAST);
    expect(mockParam.key.value).toBe("newName");
  });

  it("should return null when parameter not found", async () => {
    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [],
      optional: false,
    };

    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        optional: false,
      },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 20, end: 50, ctxt: 0 },
          decorators: [],
          pat: mockPattern,
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 51, end: 80, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(undefined);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockAST, found: result };
    });

    const result = renameParameter(mockAST, "nonExistent", "newName");

    expect(result).toBeNull();
  });

  it("should rename parameter even when key is not an Identifier but has value property", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "StringLiteral" as const,
        span: { start: 25, end: 32, ctxt: 0 },
        value: "oldName",
        raw: '"oldName"',
      },
      value: undefined,
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [mockParam],
      optional: false,
    };

    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        optional: false,
      },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 20, end: 50, ctxt: 0 },
          decorators: [],
          pat: mockPattern,
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 51, end: 80, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const mockTransformedAST = { ...mockAST };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParam);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });

    const result = renameParameter(mockAST, "oldName", "newName");

    expect(result).toBe(mockTransformedAST);
    expect(mockParam.key.value).toBe("newName");
  });

  it("should work with FunctionExpression", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "oldName",
        span: { start: 25, end: 32, ctxt: 1 },
        optional: false,
      },
      value: undefined,
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [mockParam],
      optional: false,
    };

    const mockExpression: FunctionExpression = {
      type: "FunctionExpression",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        optional: false,
      },
      params: [
        {
          type: "Parameter",
          span: { start: 20, end: 50, ctxt: 0 },
          decorators: [],
          pat: mockPattern,
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 51, end: 80, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const mockTransformedAST = { ...mockAST };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParam);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockExpression);
      return { ast: mockTransformedAST, found: result };
    });

    const result = renameParameter(mockAST, "oldName", "newName");

    expect(result).toBe(mockTransformedAST);
    expect(mockParam.key.value).toBe("newName");
  });

  it("should handle parameter with default value", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 45, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "oldName",
        span: { start: 25, end: 32, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "StringLiteral" as const,
        span: { start: 35, end: 40, ctxt: 0 },
        value: "default",
        raw: '"default"',
      },
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [mockParam],
      optional: false,
    };

    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        optional: false,
      },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 20, end: 50, ctxt: 0 },
          decorators: [],
          pat: mockPattern,
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 51, end: 80, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const mockTransformedAST = { ...mockAST };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParam);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });

    const result = renameParameter(mockAST, "oldName", "newName");

    expect(result).toBe(mockTransformedAST);
    expect(mockParam.key.value).toBe("newName");
    expect(mockParam.value).toBeDefined();
  });

  it("should return null when param is null", async () => {
    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [],
      optional: false,
    };

    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        optional: false,
      },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 20, end: 50, ctxt: 0 },
          decorators: [],
          pat: mockPattern,
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 51, end: 80, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(null as unknown as typeof mockParam);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockAST, found: result };
    });

    const result = renameParameter(mockAST, "oldName", "newName");

    expect(result).toBeNull();
  });
});

