import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renameInterfaceProperty } from "./renameInterfaceProperty";

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

describe("renameInterfaceProperty", () => {
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

  it("should rename existing property in interface", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "oldName" },
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "otherProp" },
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = renameInterfaceProperty(mockAST, "oldName", "newName");

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.key?.value).toBe("newName");
    expect(bodyMembers[1]?.key?.value).toBe("otherProp"); // Should remain unchanged
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

    const result = renameInterfaceProperty(mockAST, "nonExistentProp", "newName");

    expect(result).toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.key?.value).toBe("existingProp"); // Should remain unchanged
  });

  it("should handle interface with no body", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: null,
    };

    await mockTransformASTOrNull(mockInterface);

    const result = renameInterfaceProperty(mockAST, "anyProp", "newName");

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

    const result = renameInterfaceProperty(mockAST, "anyProp", "newName");

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
          },
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "normalProp" },
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = renameInterfaceProperty(mockAST, "normalProp", "renamedProp");

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.key?.type).toBe("StringLiteral"); // Should remain unchanged
    expect(bodyMembers[1]?.key?.value).toBe("renamedProp");
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
            key: { type: "Identifier", value: "propName" },
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = renameInterfaceProperty(mockAST, "PropName", "NewPropName");

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.key?.value).toBe("NewPropName");
    expect(bodyMembers[1]?.key?.value).toBe("propName"); // Should remain unchanged
  });

  it("should handle renaming to same name", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "propName" },
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = renameInterfaceProperty(mockAST, "propName", "propName");

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.key?.value).toBe("propName");
  });

  it("should handle empty property name", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [
          {
            type: "TsPropertySignature",
            key: { type: "Identifier", value: "" },
          },
        ],
      },
    };

    await mockTransformASTOrNull(mockInterface);

    const result = renameInterfaceProperty(mockAST, "", "newName");

    expect(result).not.toBeNull();
    const bodyMembers = mockInterface.body?.body ?? [];
    expect(bodyMembers[0]?.key?.value).toBe("newName");
  });
});
