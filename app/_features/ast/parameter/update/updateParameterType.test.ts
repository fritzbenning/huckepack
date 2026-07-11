import type { FunctionDeclaration, FunctionExpression, Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateParameterType } from "./updateParameterType";

vi.mock("@ast/utils", () => ({
  traverseExports: vi.fn(),
}));

vi.mock("@ast/interface", () => ({
  updateInterfacePropertyType: vi.fn(),
}));

vi.mock("../utils", () => ({
  findParameterByName: vi.fn(),
  getObjectPatternFromDeclaration: vi.fn(),
}));

describe("updateParameterType", () => {
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

  it("should update parameter type when parameter exists", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
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
    const mockUpdatedAST = { ...mockAST, updated: true };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { updateInterfacePropertyType } = vi.mocked(await import("@ast/interface"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParam);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });
    updateInterfacePropertyType.mockReturnValue(mockUpdatedAST);

    const result = updateParameterType(mockAST, "name", "string");

    expect(result).toBe(mockUpdatedAST);
    expect(updateInterfacePropertyType).toHaveBeenCalledWith(mockTransformedAST, "name", "string", undefined);
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

    const result = updateParameterType(mockAST, "nonExistent", "string");

    expect(result).toBeNull();
    const { updateInterfacePropertyType } = vi.mocked(await import("@ast/interface"));
    expect(updateInterfacePropertyType).not.toHaveBeenCalled();
  });

  it("should pass unionOptions to updateInterfacePropertyType", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "status",
        span: { start: 25, end: 31, ctxt: 1 },
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
    const mockUpdatedAST = { ...mockAST, updated: true };
    const unionOptions = ["active", "inactive", "pending"];

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { updateInterfacePropertyType } = vi.mocked(await import("@ast/interface"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParam);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });
    updateInterfacePropertyType.mockReturnValue(mockUpdatedAST);

    const result = updateParameterType(mockAST, "status", "string", unionOptions);

    expect(result).toBe(mockUpdatedAST);
    expect(updateInterfacePropertyType).toHaveBeenCalledWith(mockTransformedAST, "status", "string", unionOptions);
  });

  it("should work with FunctionExpression", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
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
    const mockUpdatedAST = { ...mockAST, updated: true };

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { updateInterfacePropertyType } = vi.mocked(await import("@ast/interface"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParam);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockExpression);
      return { ast: mockTransformedAST, found: result };
    });
    updateInterfacePropertyType.mockReturnValue(mockUpdatedAST);

    const result = updateParameterType(mockAST, "name", "number");

    expect(result).toBe(mockUpdatedAST);
    expect(updateInterfacePropertyType).toHaveBeenCalledWith(mockTransformedAST, "name", "number", undefined);
  });

  it("should handle numeric union options", async () => {
    const mockParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 25, end: 35, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "priority",
        span: { start: 25, end: 33, ctxt: 1 },
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
    const mockUpdatedAST = { ...mockAST, updated: true };
    const unionOptions = [1, 2, 3];

    const { traverseExports } = vi.mocked(await import("@ast/utils"));
    const { updateInterfacePropertyType } = vi.mocked(await import("@ast/interface"));
    const { findParameterByName, getObjectPatternFromDeclaration } = vi.mocked(await import("../utils"));

    getObjectPatternFromDeclaration.mockReturnValue(mockPattern);
    findParameterByName.mockReturnValue(mockParam);
    traverseExports.mockImplementation((_ast, callback) => {
      const result = callback(mockDeclaration);
      return { ast: mockTransformedAST, found: result };
    });
    updateInterfacePropertyType.mockReturnValue(mockUpdatedAST);

    const result = updateParameterType(mockAST, "priority", "number", unionOptions);

    expect(result).toBe(mockUpdatedAST);
    expect(updateInterfacePropertyType).toHaveBeenCalledWith(mockTransformedAST, "priority", "number", unionOptions);
  });
});

