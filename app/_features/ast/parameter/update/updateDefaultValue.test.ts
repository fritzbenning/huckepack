import type {
  BooleanLiteral,
  ExportDefaultDeclaration,
  FunctionExpression,
  Module,
  NumericLiteral,
  StringLiteral,
} from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateDefaultValue } from "./updateDefaultValue";

vi.mock("@ast/utils", () => ({
  traverseExports: vi.fn(),
}));

vi.mock("../utils", () => ({
  findParameterByName: vi.fn(),
  getObjectPatternFromDeclaration: vi.fn(),
}));

describe("updateDefaultValue", () => {
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

  it("should update string default value", async () => {
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
        value: "Old",
        raw: '"Old"',
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

    const result = updateDefaultValue(mockAST, "name", "New", "StringLiteral");

    expect(result).toBe(mockTransformedAST);
    expect(mockParam.value).toBeDefined();
    const stringValue = mockParam.value as StringLiteral;
    expect(stringValue.type).toBe("StringLiteral");
    expect(stringValue.value).toBe("New");
  });

  it("should update numeric default value", async () => {
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

    const result = updateDefaultValue(mockAST, "age", 42, "NumericLiteral");

    expect(result).toBe(mockTransformedAST);
    expect(mockParam.value).toBeDefined();
    const numericValue = mockParam.value as NumericLiteral;
    expect(numericValue.type).toBe("NumericLiteral");
    expect(numericValue.value).toBe(42);
  });

  it("should update boolean default value", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 40, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "enabled",
        span: { start: 25, end: 32, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "BooleanLiteral" as const,
        span: { start: 35, end: 39, ctxt: 0 },
        value: false,
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

    const result = updateDefaultValue(mockAST, "enabled", true, "BooleanLiteral");

    expect(result).toBe(mockTransformedAST);
    expect(mockParam.value).toBeDefined();
    const booleanValue = mockParam.value as BooleanLiteral;
    expect(booleanValue.type).toBe("BooleanLiteral");
    expect(booleanValue.value).toBe(true);
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

    const result = updateDefaultValue(mockAST, "nonExistent", "value", "StringLiteral");

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

    const result = updateDefaultValue(mockAST, "name", "value", "StringLiteral");

    expect(result).toBeNull();
  });

  it("should update span correctly when updating default value", async () => {
    const currentSpan = { start: 32, end: 40, ctxt: 0 };

    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 40, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "name",
        span: { start: 25, end: 29, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "StringLiteral" as const,
        span: currentSpan,
        value: "Old",
        raw: '"Old"',
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

    updateDefaultValue(mockAST, "name", "NewValue", "StringLiteral");

    expect(mockParam.value).toBeDefined();
    const stringValue = mockParam.value as StringLiteral;
    expect(stringValue.span.start).toBe(currentSpan.start);
    expect(mockParam.span.end).toBe(stringValue.span.end);
  });

  it("should handle zero numeric value", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "count",
        span: { start: 25, end: 30, ctxt: 1 },
        optional: false,
      },
      value: {
        type: "NumericLiteral" as const,
        span: { start: 33, end: 34, ctxt: 0 },
        value: 5,
        raw: "5",
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

    const result = updateDefaultValue(mockAST, "count", 0, "NumericLiteral");

    expect(result).toBe(mockTransformedAST);
    const numericValue = mockParam.value as NumericLiteral;
    expect(numericValue.value).toBe(0);
  });
});

