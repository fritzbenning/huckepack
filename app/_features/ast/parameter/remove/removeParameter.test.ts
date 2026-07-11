import type { FunctionDeclaration, FunctionExpression, Module, ObjectPattern, Pattern } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeParameter } from "./removeParameter";

// Mock dependencies
vi.mock("@ast/utils", () => ({
  traverseExports: vi.fn(),
}));

vi.mock("../utils", () => ({
  findParameterByName: vi.fn(),
  getObjectPatternFromDeclaration: vi.fn(),
}));

describe("removeParameter", () => {
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

  it("should remove parameter from function declaration", async () => {
    const mockParameter = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "targetParam",
        span: { start: 25, end: 36, ctxt: 1 },
        optional: false,
      },
      value: undefined,
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [
        {
          type: "AssignmentPatternProperty" as const,
          span: { start: 22, end: 32, ctxt: 0 },
          key: {
            type: "Identifier" as const,
            value: "otherParam",
            span: { start: 22, end: 32, ctxt: 1 },
            optional: false,
          },
          value: undefined,
        },
        mockParameter,
        {
          type: "AssignmentPatternProperty" as const,
          span: { start: 37, end: 47, ctxt: 0 },
          key: {
            type: "Identifier" as const,
            value: "anotherParam",
            span: { start: 37, end: 49, ctxt: 1 },
            optional: false,
          },
          value: undefined,
        },
      ],
      optional: false,
    };

    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: { type: "Identifier", value: "TestComponent", span: { start: 9, end: 22, ctxt: 1 }, optional: false },
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
      typeParameters: undefined,
      returnType: undefined,
    };

    const mockTransformedAST = { ...mockAST };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParameter);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });

    const result = removeParameter(mockAST, "test.tsx", "targetParam");

    expect(result).toBe(mockTransformedAST);
    expect(getObjectPatternFromDeclaration).toHaveBeenCalledWith(mockDeclaration);
    expect(findParameterByName).toHaveBeenCalledWith(mockPattern, "targetParam");
    expect(mockPattern.properties).toHaveLength(2);
    expect(mockPattern.properties).not.toContain(mockParameter);
  });

  it("should remove parameter from function expression", async () => {
    const mockParameter = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "targetParam",
        span: { start: 25, end: 36, ctxt: 1 },
        optional: false,
      },
      value: undefined,
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [mockParameter],
      optional: false,
    };

    const mockExpression: FunctionExpression = {
      type: "FunctionExpression",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: { type: "Identifier", value: "TestComponent", span: { start: 9, end: 22, ctxt: 1 }, optional: false },
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
      typeParameters: undefined,
      returnType: undefined,
    };

    const mockTransformedAST = { ...mockAST };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParameter);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockExpression);
      return { ast: mockTransformedAST, found: result };
    });

    const result = removeParameter(mockAST, "test.tsx", "targetParam");

    expect(result).toBe(mockTransformedAST);
    expect(mockPattern.properties).toHaveLength(0);
  });

  it("should return null when parameter is not found", async () => {
    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [
        {
          type: "AssignmentPatternProperty" as const,
          span: { start: 22, end: 32, ctxt: 0 },
          key: {
            type: "Identifier" as const,
            value: "otherParam",
            span: { start: 22, end: 32, ctxt: 1 },
            optional: false,
          },
          value: undefined,
        },
      ],
      optional: false,
    };

    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: { type: "Identifier", value: "TestComponent", span: { start: 9, end: 22, ctxt: 1 }, optional: false },
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
      typeParameters: undefined,
      returnType: undefined,
    };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(undefined); // Parameter not found
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockAST, found: result };
    });

    const result = removeParameter(mockAST, "test.tsx", "nonExistentParam");

    expect(result).toBeNull();
    expect(findParameterByName).toHaveBeenCalledWith(mockPattern, "nonExistentParam");
  });

  it("should return null when pattern has no properties", async () => {
    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: null,
      optional: false,
    } as unknown as {
      type: "ObjectPattern";
      span: { start: number; end: number; ctxt: number };
      properties: null;
      optional: boolean;
    };

    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: { type: "Identifier", value: "TestComponent", span: { start: 9, end: 22, ctxt: 1 }, optional: false },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 20, end: 50, ctxt: 0 },
          decorators: [],
          pat: mockPattern as unknown as Pattern,
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
      typeParameters: undefined,
      returnType: undefined,
    };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern as unknown as ObjectPattern);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockAST, found: result };
    });

    const result = removeParameter(mockAST, "test.tsx", "anyParam");

    expect(result).toBeNull();
  });

  it("should return null when pattern is null", async () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: { type: "Identifier", value: "TestComponent", span: { start: 9, end: 22, ctxt: 1 }, optional: false },
      declare: false,
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 51, end: 80, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
      typeParameters: undefined,
      returnType: undefined,
    };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(undefined);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockAST, found: result };
    });

    const result = removeParameter(mockAST, "test.tsx", "anyParam");

    expect(result).toBeNull();
  });

  it("should handle parameter not in properties array", async () => {
    const mockParameter = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "targetParam",
        span: { start: 25, end: 36, ctxt: 1 },
        optional: false,
      },
      value: undefined,
    };

    const mockOtherParameter = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 37, end: 47, ctxt: 0 },
      key: { type: "Identifier" as const, value: "otherParam", span: { start: 37, end: 47, ctxt: 1 }, optional: false },
      value: undefined,
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [mockOtherParameter], // mockParameter is not in the array
      optional: false,
    };

    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: { type: "Identifier", value: "TestComponent", span: { start: 9, end: 22, ctxt: 1 }, optional: false },
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
      typeParameters: undefined,
      returnType: undefined,
    };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParameter); // Found but not in array
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockAST, found: result };
    });

    const result = removeParameter(mockAST, "test.tsx", "targetParam");

    expect(result).toBeNull();
    expect(mockPattern.properties).toHaveLength(1);
    expect(mockPattern.properties[0]).toBe(mockOtherParameter);
  });

  it("should handle empty properties array", async () => {
    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 20, end: 50, ctxt: 0 },
      properties: [],
      optional: false,
    };

    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: { type: "Identifier", value: "TestComponent", span: { start: 9, end: 22, ctxt: 1 }, optional: false },
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
      typeParameters: undefined,
      returnType: undefined,
    };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(undefined);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockAST, found: result };
    });

    const result = removeParameter(mockAST, "test.tsx", "anyParam");

    expect(result).toBeNull();
    expect(mockPattern.properties).toHaveLength(0);
  });

  it("should handle multiple parameters and remove the correct one", async () => {
    const mockTargetParameter = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "targetParam",
        span: { start: 25, end: 36, ctxt: 1 },
        optional: false,
      },
      value: undefined,
    };

    const mockOtherParameter1 = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 15, end: 25, ctxt: 0 },
      key: { type: "Identifier" as const, value: "param1", span: { start: 15, end: 21, ctxt: 1 }, optional: false },
      value: undefined,
    };

    const mockOtherParameter2 = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 35, end: 45, ctxt: 0 },
      key: { type: "Identifier" as const, value: "param2", span: { start: 35, end: 41, ctxt: 1 }, optional: false },
      value: undefined,
    };

    const mockPattern = {
      type: "ObjectPattern" as const,
      span: { start: 10, end: 50, ctxt: 0 },
      properties: [mockOtherParameter1, mockTargetParameter, mockOtherParameter2],
      optional: false,
    };

    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 80, ctxt: 0 },
      identifier: { type: "Identifier", value: "TestComponent", span: { start: 9, end: 22, ctxt: 1 }, optional: false },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 10, end: 50, ctxt: 0 },
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
      typeParameters: undefined,
      returnType: undefined,
    };

    const mockTransformedAST = { ...mockAST };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockTargetParameter);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });

    const result = removeParameter(mockAST, "test.tsx", "targetParam");

    expect(result).toBe(mockTransformedAST);
    expect(mockPattern.properties).toHaveLength(2);
    expect(mockPattern.properties).toContain(mockOtherParameter1);
    expect(mockPattern.properties).toContain(mockOtherParameter2);
    expect(mockPattern.properties).not.toContain(mockTargetParameter);
  });
});
