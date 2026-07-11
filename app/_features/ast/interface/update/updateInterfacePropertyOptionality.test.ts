import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateInterfacePropertyOptionality } from "./updateInterfacePropertyOptionality";

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

describe("updateInterfacePropertyOptionality", () => {
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

  it("should make property optional", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "targetProp" },
            optional: false,
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "otherProp" },
            optional: false,
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = updateInterfacePropertyOptionality(mockAST, "targetProp", true);

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.optional).toBe(true);
    expect(bodyMembers[1]?.optional).toBe(false); // Should remain unchanged
  });

  it("should make property required", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "targetProp" },
            optional: true,
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = updateInterfacePropertyOptionality(mockAST, "targetProp", false);

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.optional).toBe(false);
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
            optional: false,
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = updateInterfacePropertyOptionality(mockAST, "nonExistentProp", true);

    expect(result).toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.optional).toBe(false); // Should remain unchanged
  });

  it("should handle interface with no body", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: null,
    };

    await mockTransformASTOrNull(mockInterface);

    const result = updateInterfacePropertyOptionality(mockAST, "anyProp", true);

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

    const result = updateInterfacePropertyOptionality(mockAST, "anyProp", true);

    expect(result).toBeNull();
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
            optional: false,
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "normalProp" },
            optional: false,
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = updateInterfacePropertyOptionality(mockAST, "normalProp", true);

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.optional).toBe(false); // Should remain unchanged
    expect(bodyMembers[1]?.optional).toBe(true);
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
            optional: false,
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "propName" },
            optional: false,
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = updateInterfacePropertyOptionality(mockAST, "PropName", true);

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.optional).toBe(true);
    expect(bodyMembers[1]?.optional).toBe(false); // Should remain unchanged
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
            key: { type: "Identifier", value: "prop" },
            optional: false,
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = updateInterfacePropertyOptionality(mockAST, "prop", true);

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[1]?.optional).toBe(true);
  });

  it("should handle updating already optional property to optional", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "optionalProp" },
            optional: true,
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = updateInterfacePropertyOptionality(mockAST, "optionalProp", true);

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.optional).toBe(true);
  });

  it("should handle updating already required property to required", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "requiredProp" },
            optional: false,
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = updateInterfacePropertyOptionality(mockAST, "requiredProp", false);

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.optional).toBe(false);
  });
});
