import type { Module } from "@swc/wasm-web";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addValueToStringLiteral } from "./addValueToStringLiteral";

// Mock dependencies
vi.mock("@ast/type-check", () => ({
  isStringLiteral: vi.fn(),
}));

vi.mock("@ast/utils", () => ({
  createTransformedAST: vi.fn(),
}));

vi.mock("swc-walk", () => ({
  simple: vi.fn(),
}));

describe("addValueToStringLiteral", () => {
  let mockAST: Module;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetAllMocks();
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [],
      interpreter: null,
    } as unknown as Module;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("should add value to existing string literal", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "existing-class",
      raw: '"existing-class"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = addValueToStringLiteral(mockAST, 10, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("existing-class new-class");
    expect(mockStringLiteral.raw).toBe('"existing-class new-class"');
    expect(createTransformedAST).toHaveBeenCalledWith(mockAST);
    expect(simple).toHaveBeenCalledWith(mockTransformedAST, expect.any(Object));
  });

  it("should add value to empty string literal", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 12, ctxt: 0 },
      value: "",
      raw: '""',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = addValueToStringLiteral(mockAST, 10, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("new-class");
    expect(mockStringLiteral.raw).toBe('"new-class"');
  });

  it("should normalize whitespace when adding value", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 30, ctxt: 0 },
      value: "  class1   class2  ",
      raw: '"  class1   class2  "',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = addValueToStringLiteral(mockAST, 10, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("class1 class2 new-class");
    expect(mockStringLiteral.raw).toBe('"class1 class2 new-class"');
  });

  it("should handle whitespace-only string literal", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      value: "   \n\t  ",
      raw: '"   \n\t  "',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = addValueToStringLiteral(mockAST, 10, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("new-class");
    expect(mockStringLiteral.raw).toBe('"new-class"');
  });

  it("should not modify string literal when span doesn't match", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 999, end: 1010, ctxt: 0 }, // Different span
      value: "existing-class",
      raw: '"existing-class"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = addValueToStringLiteral(mockAST, 10, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("existing-class"); // Unchanged
    expect(mockStringLiteral.raw).toBe('"existing-class"'); // Unchanged
    expect(consoleErrorSpy).toHaveBeenCalledWith("String literal not found at start", 10);
  });

  it("should not modify when node is not a string literal", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "existing-class",
      raw: '"existing-class"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(false); // Not a string literal
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = addValueToStringLiteral(mockAST, 10, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("existing-class"); // Unchanged
    expect(mockStringLiteral.raw).toBe('"existing-class"'); // Unchanged
    expect(consoleErrorSpy).toHaveBeenCalledWith("String literal not found at start", 10);
  });

  it("should handle multiple consecutive spaces in value to add", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "existing-class",
      raw: '"existing-class"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = addValueToStringLiteral(mockAST, 10, "new   class   with   spaces");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("existing-class new class with spaces");
    expect(mockStringLiteral.raw).toBe('"existing-class new class with spaces"');
  });

  it("should handle empty value to add", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "existing-class",
      raw: '"existing-class"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = addValueToStringLiteral(mockAST, 10, "");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("existing-class");
    expect(mockStringLiteral.raw).toBe('"existing-class"');
  });

  it("should handle whitespace-only value to add", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "existing-class",
      raw: '"existing-class"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = addValueToStringLiteral(mockAST, 10, "   \n\t  ");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("existing-class");
    expect(mockStringLiteral.raw).toBe('"existing-class"');
  });

  it("should handle multiple string literals and only modify the matching one", async () => {
    const mockStringLiteral1 = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "class1",
      raw: '"class1"',
    };

    const mockStringLiteral2 = {
      type: "StringLiteral" as const,
      span: { start: 30, end: 40, ctxt: 0 },
      value: "class2",
      raw: '"class2"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral1, {});
        visitors.StringLiteral(mockStringLiteral2, {});
      }
    });

    const result = addValueToStringLiteral(mockAST, 30, "new-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral1.value).toBe("class1"); // Unchanged
    expect(mockStringLiteral1.raw).toBe('"class1"'); // Unchanged
    expect(mockStringLiteral2.value).toBe("class2 new-class"); // Modified
    expect(mockStringLiteral2.raw).toBe('"class2 new-class"'); // Modified
  });

  it("should handle special characters in value to add", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "existing-class",
      raw: '"existing-class"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = addValueToStringLiteral(mockAST, 10, "class-with-dashes_and_underscores");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("existing-class class-with-dashes_and_underscores");
    expect(mockStringLiteral.raw).toBe('"existing-class class-with-dashes_and_underscores"');
  });
});
