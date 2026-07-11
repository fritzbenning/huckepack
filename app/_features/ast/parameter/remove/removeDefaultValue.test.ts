import type {
  BooleanLiteral,
  ExportDefaultDeclaration,
  FunctionExpression,
  Module,
  NumericLiteral,
  StringLiteral,
} from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeDefaultValue } from "./removeDefaultValue";

vi.mock("@ast/utils", () => ({
  traverseExports: vi.fn(),
}));

vi.mock("../utils", () => ({
  findParameterByName: vi.fn(),
  getObjectPatternFromDeclaration: vi.fn(),
}));

describe("removeDefaultValue", () => {
  let mockAST: Module;

  beforeEach(() => {
    vi.resetAllMocks();

    mockAST = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [],
      interpreter: null,
    } as unknown as Module;
  });

  it("should remove default value from parameter", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 45, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "name",
        span: { start: 25, end: 29, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "StringLiteral" as const,
        span: { start: 32, end: 40, ctxt: 0 },
        value: "John",
        raw: '"John"',
      } as StringLiteral,
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [mockParam],
      optional: false,
    };

    const mockDeclaration: FunctionExpression = {
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
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });

    const result = removeDefaultValue(mockAST, "test.tsx", "name");

    expect(result).toBe(mockTransformedAST);
    expect(mockParam.value).toBeUndefined();
    expect(mockParam.span.end).toBe(mockParam.key.span.end);
  });

  it("should return null when parameter not found", async () => {
    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [],
      optional: false,
    };

    const mockDeclaration: FunctionExpression = {
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

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(undefined);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockAST, found: result };
    });

    const result = removeDefaultValue(mockAST, "test.tsx", "nonExistent");

    expect(result).toBeNull();
  });

  it("should return null when parameter has no default value", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 29, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "name",
        span: { start: 25, end: 29, ctxt: 1 },
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

    const mockDeclaration: FunctionExpression = {
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

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParam);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockAST, found: result };
    });

    const result = removeDefaultValue(mockAST, "test.tsx", "name");

    expect(result).toBeNull();
  });

  it("should handle numeric default value", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "age",
        span: { start: 25, end: 28, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "NumericLiteral" as const,
        span: { start: 31, end: 33, ctxt: 0 },
        value: 25,
        raw: "25",
      } as NumericLiteral,
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [mockParam],
      optional: false,
    };

    const mockDeclaration: FunctionExpression = {
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
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });

    const result = removeDefaultValue(mockAST, "test.tsx", "age");

    expect(result).toBe(mockTransformedAST);
    expect(mockParam.value).toBeUndefined();
  });

  it("should handle boolean default value", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "enabled",
        span: { start: 25, end: 32, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "BooleanLiteral" as const,
        span: { start: 35, end: 39, ctxt: 0 },
        value: true,
      } as BooleanLiteral,
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [mockParam],
      optional: false,
    };

    const mockDeclaration: FunctionExpression = {
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
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });

    const result = removeDefaultValue(mockAST, "test.tsx", "enabled");

    expect(result).toBe(mockTransformedAST);
    expect(mockParam.value).toBeUndefined();
  });

  it("should update span correctly when removing default value", async () => {
    const keySpan = { start: 25, end: 29, ctxt: 1 };
    const valueSpan = { start: 32, end: 40, ctxt: 0 };

    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 40, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "name",
        span: keySpan,
        optional: false,
      },
      value: {
        type: "StringLiteral" as const,
        span: valueSpan,
        value: "John",
        raw: '"John"',
      } as StringLiteral,
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [mockParam],
      optional: false,
    };

    const mockDeclaration: FunctionExpression = {
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
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });

    removeDefaultValue(mockAST, "test.tsx", "name");

    expect(mockParam.span.start).toBe(25);
    expect(mockParam.span.end).toBe(keySpan.end);
    expect(mockParam.span.ctxt).toBe(mockParam.span.ctxt);
  });
});

