import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeInterfaceProperty } from "./removeInterfaceProperty";

type TransformASTOrNull = typeof import("@ast/utils")["transformASTOrNull"];
type InterfaceVisitor = Parameters<TransformASTOrNull>[1];

const runInterfaceVisitor = (visitors: InterfaceVisitor, mockInterface: unknown) =>
  (visitors as { TsInterfaceDeclaration?: (node: unknown) => unknown }).TsInterfaceDeclaration?.(mockInterface);

const mockTransformASTOrNull = async (mockInterface: unknown) => {
  const { transformASTOrNull } = vi.mocked(await import("@ast/utils"));
  transformASTOrNull.mockImplementation((ast, visitors) => {
    const result = runInterfaceVisitor(visitors, mockInterface);
    return result ? { ...ast } : null;
  });
};

// Mock dependencies
vi.mock("@ast/utils", () => ({
  transformASTOrNull: vi.fn(),
}));

describe("removeInterfaceProperty", () => {
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

  it("should remove existing property from interface", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "propToRemove" },
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "propToKeep" },
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = removeInterfaceProperty(mockAST, "propToRemove");

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers).toHaveLength(1);
    expect(bodyMembers[0]?.key?.value).toBe("propToKeep");
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
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = removeInterfaceProperty(mockAST, "nonExistentProp");

    expect(result).toBeNull();
    expect(mockInterface.body.body).toHaveLength(1); // Property should remain
  });

  it("should handle interface with no body", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: null,
    };

    await mockTransformASTOrNull(mockInterface);

    const result = removeInterfaceProperty(mockAST, "anyProp");

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

    await mockTransformASTOrNull(mockInterface);

    const result = removeInterfaceProperty(mockAST, "anyProp");

    expect(result).toBeNull();
    expect(mockInterface.body.body).toHaveLength(0);
  });

  it("should remove first matching property when multiple exist", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "prop1" },
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "targetProp" },
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "prop3" },
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = removeInterfaceProperty(mockAST, "targetProp");

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers).toHaveLength(2);
    expect(bodyMembers[0]?.key?.value).toBe("prop1");
    expect(bodyMembers[1]?.key?.value).toBe("prop3");
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
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "normalProp" },
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = removeInterfaceProperty(mockAST, "normalProp");

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers).toHaveLength(1);
    expect(bodyMembers[0]?.key?.type).toBe("StringLiteral");
  });

  it("should handle non-property signature members", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsMethodSignature",
            key: { type: "Identifier", value: "method" },
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "propToRemove" },
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = removeInterfaceProperty(mockAST, "propToRemove");

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers).toHaveLength(1);
    expect(bodyMembers[0]?.type).toBe("TsMethodSignature");
  });

  it("should be case sensitive when matching property names", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "PropName" },
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "propname" },
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = removeInterfaceProperty(mockAST, "PropName");

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers).toHaveLength(1);
    expect(bodyMembers[0]?.key?.value).toBe("propname");
  });

  it("should handle removing the last property", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "onlyProp" },
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = removeInterfaceProperty(mockAST, "onlyProp");

    expect(result).not.toBeNull();
    expect(mockInterface.body.body).toHaveLength(0);
  });
});
