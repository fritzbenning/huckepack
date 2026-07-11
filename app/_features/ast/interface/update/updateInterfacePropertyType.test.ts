import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateInterfacePropertyType } from "./updateInterfacePropertyType";

// Mock dependencies
vi.mock("@ast/utils", () => ({
  transformASTOrNull: vi.fn(),
}));

vi.mock("@ast/types/create/createTsType", () => ({
  createTsType: vi.fn(),
  createTsUnionType: vi.fn(),
}));

describe("updateInterfacePropertyType", () => {
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

  it("should update property type to string", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "targetProp" },
            typeAnnotation: {
              type: "TsTypeAnnotation",
              typeAnnotation: { type: "TsKeywordType", kind: "number" },
            },
          },
        ],
      },
    };

    const mockTsType = { type: "TsKeywordType" as const, span: { start: 0, end: 6, ctxt: 0 }, kind: "string" as const };

    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
    const { createTsType } = vi.mocked(await import("@ast/types/create/createTsType"));

    createTsType.mockReturnValue(mockTsType);
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const result = (visitors.TsInterfaceDeclaration as ((node: unknown) => unknown) | undefined)?.(mockInterface);
      return result ? { ...ast } : null;
    });

    const result = updateInterfacePropertyType(mockAST, "targetProp", "string");

    expect(result).not.toBeNull();
    expect(createTsType).toHaveBeenCalledWith("string");
    expect(
      (mockInterface.body.body[0] as { typeAnnotation: { typeAnnotation: unknown } }).typeAnnotation.typeAnnotation
    ).toBe(mockTsType);
  });

  it("should update property type with union options", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "status" },
            typeAnnotation: {
              type: "TsTypeAnnotation",
              typeAnnotation: { type: "TsKeywordType", kind: "string" },
            },
          },
        ],
      },
    };

    const mockUnionType = {
      type: "TsUnionType" as const,
      span: { start: 0, end: 0, ctxt: 0 },
      types: [
        {
          type: "TsLiteralType" as const,
          span: { start: 0, end: 0, ctxt: 0 },
          literal: {
            type: "StringLiteral" as const,
            span: { start: 0, end: 0, ctxt: 0 },
            value: "active",
            raw: '"active"',
          },
        },
        {
          type: "TsLiteralType" as const,
          span: { start: 0, end: 0, ctxt: 0 },
          literal: {
            type: "StringLiteral" as const,
            span: { start: 0, end: 0, ctxt: 0 },
            value: "inactive",
            raw: '"inactive"',
          },
        },
      ],
    };

    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
    const { createTsUnionType } = vi.mocked(await import("@ast/types/create/createTsType"));

    createTsUnionType.mockReturnValue(mockUnionType);
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const result = (visitors.TsInterfaceDeclaration as ((node: unknown) => unknown) | undefined)?.(mockInterface);
      return result ? { ...ast } : null;
    });

    const result = updateInterfacePropertyType(mockAST, "status", "string", ["active", "inactive"]);

    expect(result).not.toBeNull();
    expect(createTsUnionType).toHaveBeenCalledWith(["active", "inactive"]);
    expect(
      (mockInterface.body.body[0] as { typeAnnotation: { typeAnnotation: unknown } }).typeAnnotation.typeAnnotation
    ).toBe(mockUnionType);
  });

  it("should return null if property does not exist", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "existingProp" },
            typeAnnotation: {
              type: "TsTypeAnnotation",
              typeAnnotation: { type: "TsKeywordType", kind: "string" },
            },
          },
        ],
      },
    };

    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const result = (visitors.TsInterfaceDeclaration as ((node: unknown) => unknown) | undefined)?.(mockInterface);
      return result ? { ...ast } : null;
    });

    const result = updateInterfacePropertyType(mockAST, "nonExistentProp", "number");

    expect(result).toBeNull();
  });

  it("should handle interface with no body", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: null,
    };

    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const result = (visitors.TsInterfaceDeclaration as ((node: unknown) => unknown) | undefined)?.(mockInterface);
      return result ? { ...ast } : null;
    });

    const result = updateInterfacePropertyType(mockAST, "anyProp", "string");

    expect(result).toBeNull();
  });

  it("should handle interface with empty body", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [],
      },
    };

    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const result = (visitors.TsInterfaceDeclaration as ((node: unknown) => unknown) | undefined)?.(mockInterface);
      return result ? { ...ast } : null;
    });

    const result = updateInterfacePropertyType(mockAST, "anyProp", "string");

    expect(result).toBeNull();
  });

  it("should handle numeric union options", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "priority" },
            typeAnnotation: {
              type: "TsTypeAnnotation",
              typeAnnotation: { type: "TsKeywordType", kind: "number" },
            },
          },
        ],
      },
    };

    const mockUnionType = {
      type: "TsUnionType" as const,
      span: { start: 0, end: 0, ctxt: 0 },
      types: [
        {
          type: "TsLiteralType" as const,
          span: { start: 0, end: 0, ctxt: 0 },
          literal: { type: "NumericLiteral" as const, span: { start: 0, end: 0, ctxt: 0 }, value: 1, raw: "1" },
        },
        {
          type: "TsLiteralType" as const,
          span: { start: 0, end: 0, ctxt: 0 },
          literal: { type: "NumericLiteral" as const, span: { start: 0, end: 0, ctxt: 0 }, value: 2, raw: "2" },
        },
        {
          type: "TsLiteralType" as const,
          span: { start: 0, end: 0, ctxt: 0 },
          literal: { type: "NumericLiteral" as const, span: { start: 0, end: 0, ctxt: 0 }, value: 3, raw: "3" },
        },
      ],
    };

    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
    const { createTsUnionType } = vi.mocked(await import("@ast/types/create/createTsType"));

    createTsUnionType.mockReturnValue(mockUnionType);
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const result = (visitors.TsInterfaceDeclaration as ((node: unknown) => unknown) | undefined)?.(mockInterface);
      return result ? { ...ast } : null;
    });

    const result = updateInterfacePropertyType(mockAST, "priority", "number", [1, 2, 3]);

    expect(result).not.toBeNull();
    expect(createTsUnionType).toHaveBeenCalledWith(["1", "2", "3"]);
  });

  it("should handle boolean union options", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "isActive" },
            typeAnnotation: {
              type: "TsTypeAnnotation",
              typeAnnotation: { type: "TsKeywordType", kind: "boolean" },
            },
          },
        ],
      },
    };

    const mockUnionType = {
      type: "TsUnionType" as const,
      span: { start: 0, end: 0, ctxt: 0 },
      types: [
        {
          type: "TsLiteralType" as const,
          span: { start: 0, end: 0, ctxt: 0 },
          literal: { type: "BooleanLiteral" as const, span: { start: 0, end: 0, ctxt: 0 }, value: true },
        },
        {
          type: "TsLiteralType" as const,
          span: { start: 0, end: 0, ctxt: 0 },
          literal: { type: "BooleanLiteral" as const, span: { start: 0, end: 0, ctxt: 0 }, value: false },
        },
      ],
    };

    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
    const { createTsUnionType } = vi.mocked(await import("@ast/types/create/createTsType"));

    createTsUnionType.mockReturnValue(mockUnionType);
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const result = (visitors.TsInterfaceDeclaration as ((node: unknown) => unknown) | undefined)?.(mockInterface);
      return result ? { ...ast } : null;
    });

    const result = updateInterfacePropertyType(mockAST, "isActive", "boolean", [true, false]);

    expect(result).not.toBeNull();
    expect(createTsUnionType).toHaveBeenCalledWith(["true", "false"]);
  });

  it("should handle property with non-identifier key", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "StringLiteral", value: "stringKey" },
            typeAnnotation: {
              type: "TsTypeAnnotation",
              typeAnnotation: { type: "TsKeywordType", kind: "string" },
            },
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "normalProp" },
            typeAnnotation: {
              type: "TsTypeAnnotation",
              typeAnnotation: { type: "TsKeywordType", kind: "string" },
            },
          },
        ],
      },
    };

    const mockTsType = { type: "TsKeywordType" as const, span: { start: 0, end: 6, ctxt: 0 }, kind: "number" as const };

    const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
    const { createTsType } = vi.mocked(await import("@ast/types/create/createTsType"));

    createTsType.mockReturnValue(mockTsType);
    transformASTOrNull.mockImplementation((ast, visitors) => {
      const result = (visitors.TsInterfaceDeclaration as ((node: unknown) => unknown) | undefined)?.(mockInterface);
      return result ? { ...ast } : null;
    });

    const result = updateInterfacePropertyType(mockAST, "normalProp", "number");

    expect(result).not.toBeNull();
    expect(
      (mockInterface.body.body[1] as { typeAnnotation: { typeAnnotation: unknown } }).typeAnnotation.typeAnnotation
    ).toBe(mockTsType);
  });
});
