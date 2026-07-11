import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addInterfaceProperty } from "./addInterfaceProperty";

// Mock dependencies
vi.mock("@ast/utils", () => ({
  transformAST: vi.fn(),
}));

vi.mock("@ast/interface/create/createInterface", () => ({
  createInterface: vi.fn(),
}));

describe("addInterfaceProperty", () => {
  let mockAST: Module;
  type InterfaceVisitor = { TsInterfaceDeclaration?: (node: unknown) => unknown };
  const invokeInterfaceVisitor = (visitors: unknown, node: unknown) =>
    (visitors as InterfaceVisitor).TsInterfaceDeclaration?.(node);

  beforeEach(() => {
    vi.resetAllMocks();
    mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [],
      interpreter: null as unknown as string,
    } as unknown as Module;
  });

  it("should add property to existing interface", async () => {
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

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const result = invokeInterfaceVisitor(visitors, mockInterface);
      return {
        ast: { ...ast },
        found: result === true,
      };
    });

    const result = addInterfaceProperty(mockAST, "newProp", "string");

    expect(result).not.toBeNull();
    expect(transformAST).toHaveBeenCalledWith(
      mockAST,
      expect.objectContaining({
        TsInterfaceDeclaration: expect.any(Function),
      })
    );
  });

  it("should not add property if it already exists", async () => {
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

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const result = invokeInterfaceVisitor(visitors, mockInterface);
      return {
        ast: { ...ast },
        found: result === true,
      };
    });

    const result = addInterfaceProperty(mockAST, "existingProp", "string");

    expect(result).toBeNull();
  });

  it("should add optional property", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [],
      },
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      invokeInterfaceVisitor(visitors, mockInterface);
      return {
        ast: { ...ast },
        found: true,
      };
    });

    const result = addInterfaceProperty(mockAST, "optionalProp", "string", undefined, true);

    expect(result).not.toBeNull();
    expect(mockInterface.body.body).toHaveLength(1);
    const propertySignature = mockInterface.body.body[0] as { optional?: boolean };
    expect(propertySignature.optional).toBe(true);
  });

  it("should add property with union type", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [],
      },
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      invokeInterfaceVisitor(visitors, mockInterface);
      return {
        ast: { ...ast },
        found: true,
      };
    });

    const result = addInterfaceProperty(mockAST, "status", "string", ["active", "inactive", "pending"]);

    expect(result).not.toBeNull();
    expect(mockInterface.body.body).toHaveLength(1);
  });

  it("should create new interface if none exists and fileName provided", async () => {
    const { transformAST } = vi.mocked(await import("@ast/utils"));
    const { createInterface } = vi.mocked(await import("@ast/interface/create/createInterface"));

    transformAST.mockReturnValue({
      ast: mockAST,
      found: false,
    });

    const mockNewAST = {
      ...mockAST,
      body: [{ type: "TsInterfaceDeclaration" } as Module["body"][number]],
    } as Module;
    createInterface.mockReturnValue(mockNewAST);

    const result = addInterfaceProperty(mockAST, "newProp", "string", undefined, false, "TestComponent");

    expect(createInterface).toHaveBeenCalledWith(mockAST, "TestComponent", "newProp", "string", undefined, false);
    expect(result).toBe(mockNewAST);
  });

  it("should return null if no interface found and no fileName provided", async () => {
    const { transformAST } = vi.mocked(await import("@ast/utils"));

    transformAST.mockReturnValue({
      ast: mockAST,
      found: false,
    });

    const result = addInterfaceProperty(mockAST, "newProp", "string");

    expect(result).toBeNull();
  });

  it("should handle interface without body", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: null,
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const result = invokeInterfaceVisitor(visitors, mockInterface);
      return {
        ast: { ...ast },
        found: result === true,
      };
    });

    const result = addInterfaceProperty(mockAST, "newProp", "string");

    expect(result).toBeNull();
  });

  it("should handle numeric union options", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [],
      },
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      invokeInterfaceVisitor(visitors, mockInterface);
      return {
        ast: { ...ast },
        found: true,
      };
    });

    const result = addInterfaceProperty(mockAST, "priority", "number", [1, 2, 3, 4, 5]);

    expect(result).not.toBeNull();
    expect(mockInterface.body.body).toHaveLength(1);
  });

  it("should handle boolean union options", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [],
      },
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      invokeInterfaceVisitor(visitors, mockInterface);
      return {
        ast: { ...ast },
        found: true,
      };
    });

    const result = addInterfaceProperty(mockAST, "isEnabled", "boolean", [true, false]);

    expect(result).not.toBeNull();
    expect(mockInterface.body.body).toHaveLength(1);
  });

  it("should handle mixed union options", async () => {
    const mockInterface = {
      type: "TsInterfaceDeclaration",
      id: { type: "Identifier", value: "TestInterface" },
      body: {
        body: [],
      },
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      invokeInterfaceVisitor(visitors, mockInterface);
      return {
        ast: { ...ast },
        found: true,
      };
    });

    const result = addInterfaceProperty(mockAST, "value", "mixed", ["string", 42, true, "another"]);

    expect(result).not.toBeNull();
    expect(mockInterface.body.body).toHaveLength(1);
  });
});
