import type {
  ExportDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  FunctionDeclaration,
  FunctionExpression,
} from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { extractFunctionFromForwardRef } from "./extractFunctionFromForwardRef";
import { getDeclarationFromExport } from "./getDeclarationFromExport";

vi.mock("./extractFunctionFromForwardRef", () => ({
  extractFunctionFromForwardRef: vi.fn(),
}));

describe("getDeclarationFromExport", () => {
  it("should return FunctionDeclaration from ExportDefaultDeclaration", () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        optional: false,
      },
      declare: false,
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 25, end: 50, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const exportNode: ExportDefaultDeclaration = {
      type: "ExportDefaultDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      decl: mockDeclaration,
    };

    const result = getDeclarationFromExport(exportNode);

    expect(result).toBe(mockDeclaration);
  });

  it("should return FunctionExpression from ExportDefaultDeclaration", () => {
    const mockExpression: FunctionExpression = {
      type: "FunctionExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        optional: false,
      },
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 25, end: 50, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const exportNode: ExportDefaultDeclaration = {
      type: "ExportDefaultDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      decl: mockExpression,
    };

    const result = getDeclarationFromExport(exportNode);

    expect(result).toBe(mockExpression);
  });

  it("should extract FunctionExpression from forwardRef in ExportDefaultDeclaration", () => {
    const mockFunction: FunctionExpression = {
      type: "FunctionExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "Component",
        span: { start: 0, end: 9, ctxt: 1 },
        optional: false,
      },
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 10, end: 50, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const mockCallExpr = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
    };

    vi.mocked(extractFunctionFromForwardRef).mockReturnValue(mockFunction);

    const exportNode: ExportDefaultDeclaration = {
      type: "ExportDefaultDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      decl: mockCallExpr as unknown as (typeof exportNode.decl),
    };

    const result = getDeclarationFromExport(exportNode);

    expect(result).toBe(mockFunction);
    expect(extractFunctionFromForwardRef).toHaveBeenCalledWith(mockCallExpr);
  });

  it("should return FunctionDeclaration from ExportNamedDeclaration with declaration property", () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        optional: false,
      },
      declare: false,
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 25, end: 50, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const exportNode: ExportNamedDeclaration = {
      type: "ExportNamedDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      declaration: mockDeclaration,
      specifiers: [],
    };

    const result = getDeclarationFromExport(exportNode);

    expect(result).toBe(mockDeclaration);
  });

  it("should return FunctionExpression from ExportNamedDeclaration with decl property", () => {
    const mockExpression: FunctionExpression = {
      type: "FunctionExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        optional: false,
      },
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 25, end: 50, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const exportNode = {
      type: "ExportNamedDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      decl: mockExpression,
      specifiers: [],
    } as unknown as ExportNamedDeclaration;

    const result = getDeclarationFromExport(exportNode);

    expect(result).toBe(mockExpression);
  });

  it("should extract FunctionExpression from forwardRef in ExportNamedDeclaration", () => {
    const mockFunction: FunctionExpression = {
      type: "FunctionExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "Component",
        span: { start: 0, end: 9, ctxt: 1 },
        optional: false,
      },
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 10, end: 50, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const mockCallExpr = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
    };

    vi.mocked(extractFunctionFromForwardRef).mockReturnValue(mockFunction);

    const exportNode = {
      type: "ExportNamedDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      decl: mockCallExpr,
      specifiers: [],
    } as unknown as ExportNamedDeclaration;

    const result = getDeclarationFromExport(exportNode);

    expect(result).toBe(mockFunction);
    expect(extractFunctionFromForwardRef).toHaveBeenCalledWith(mockCallExpr);
  });

  it("should return FunctionDeclaration from ExportDeclaration", () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        optional: false,
      },
      declare: false,
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 25, end: 50, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const exportNode: ExportDeclaration = {
      type: "ExportDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      declaration: mockDeclaration,
    };

    const result = getDeclarationFromExport(exportNode);

    expect(result).toBe(mockDeclaration);
  });

  it("should return undefined for unknown node type", () => {
    const unknownNode = {
      type: "UnknownType",
      span: { start: 0, end: 50, ctxt: 0 },
    };

    const result = getDeclarationFromExport(unknownNode);

    expect(result).toBeUndefined();
  });

  it("should return undefined when ExportDefaultDeclaration has no decl", () => {
    const exportNode: ExportDefaultDeclaration = {
      type: "ExportDefaultDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      decl: null as unknown as (typeof exportNode.decl),
    };

    const result = getDeclarationFromExport(exportNode);

    expect(result).toBeUndefined();
  });

  it("should return undefined when forwardRef extraction returns undefined", () => {
    const mockCallExpr = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
    };

    vi.mocked(extractFunctionFromForwardRef).mockReturnValue(undefined);

    const exportNode: ExportDefaultDeclaration = {
      type: "ExportDefaultDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      decl: mockCallExpr as unknown as (typeof exportNode.decl),
    };

    const result = getDeclarationFromExport(exportNode);

    expect(result).toBeUndefined();
  });
});

