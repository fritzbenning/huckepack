import type { Module } from "@swc/wasm-web";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { removeValueFromStringLiteral } from "./removeValueFromStringLiteral";

// Mock dependencies
vi.mock("@ast/type-check", () => ({
  isStringLiteral: vi.fn(),
}));

vi.mock("@ast/utils", () => ({
  removeClassToken: vi.fn(),
  createTransformedAST: vi.fn(),
}));

vi.mock("swc-walk", () => ({
  simple: vi.fn(),
}));

describe("removeValueFromStringLiteral", () => {
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

  it("should remove value from string literal", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 35, ctxt: 0 },
      value: "class1 target-class class2",
      raw: '"class1 target-class class2"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { removeClassToken, createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    removeClassToken.mockReturnValue("class1 class2");
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = removeValueFromStringLiteral(mockAST, 10, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("class1 class2");
    expect(mockStringLiteral.raw).toBe('"class1 class2"');
    expect(removeClassToken).toHaveBeenCalledWith("class1 target-class class2", "target-class");
    expect(createTransformedAST).toHaveBeenCalledWith(mockAST);
    expect(simple).toHaveBeenCalledWith(mockTransformedAST, expect.any(Object));
  });

  it("should remove value from string literal with single class", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "target-class",
      raw: '"target-class"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { removeClassToken, createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    removeClassToken.mockReturnValue("");
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = removeValueFromStringLiteral(mockAST, 10, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("");
    expect(mockStringLiteral.raw).toBe('""');
    expect(removeClassToken).toHaveBeenCalledWith("target-class", "target-class");
  });

  it("should handle removal when class doesn't exist", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 30, ctxt: 0 },
      value: "class1 class2 class3",
      raw: '"class1 class2 class3"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { removeClassToken, createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    removeClassToken.mockReturnValue("class1 class2 class3"); // No change
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = removeValueFromStringLiteral(mockAST, 10, "nonexistent-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("class1 class2 class3");
    expect(mockStringLiteral.raw).toBe('"class1 class2 class3"');
    expect(removeClassToken).toHaveBeenCalledWith("class1 class2 class3", "nonexistent-class");
  });

  it("should handle empty string literal", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 12, ctxt: 0 },
      value: "",
      raw: '""',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { removeClassToken, createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    removeClassToken.mockReturnValue("");
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = removeValueFromStringLiteral(mockAST, 10, "any-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("");
    expect(mockStringLiteral.raw).toBe('""');
    expect(removeClassToken).toHaveBeenCalledWith("", "any-class");
  });

  it("should not modify string literal when span doesn't match", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 999, end: 1010, ctxt: 0 }, // Different span
      value: "class1 target-class class2",
      raw: '"class1 target-class class2"',
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

    const result = removeValueFromStringLiteral(mockAST, 10, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("class1 target-class class2"); // Unchanged
    expect(mockStringLiteral.raw).toBe('"class1 target-class class2"'); // Unchanged
    expect(consoleErrorSpy).toHaveBeenCalledWith("String literal not found at start", 10);
  });

  it("should not modify when node is not a string literal", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 35, ctxt: 0 },
      value: "class1 target-class class2",
      raw: '"class1 target-class class2"',
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

    const result = removeValueFromStringLiteral(mockAST, 10, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("class1 target-class class2"); // Unchanged
    expect(mockStringLiteral.raw).toBe('"class1 target-class class2"'); // Unchanged
    expect(consoleErrorSpy).toHaveBeenCalledWith("String literal not found at start", 10);
  });

  it("should handle multiple string literals and only modify the matching one", async () => {
    const mockStringLiteral1 = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "class1 class2",
      raw: '"class1 class2"',
    };

    const mockStringLiteral2 = {
      type: "StringLiteral" as const,
      span: { start: 30, end: 50, ctxt: 0 },
      value: "class3 target-class class4",
      raw: '"class3 target-class class4"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { removeClassToken, createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    removeClassToken.mockReturnValue("class3 class4");
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral1, {});
        visitors.StringLiteral(mockStringLiteral2, {});
      }
    });

    const result = removeValueFromStringLiteral(mockAST, 30, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral1.value).toBe("class1 class2"); // Unchanged
    expect(mockStringLiteral1.raw).toBe('"class1 class2"'); // Unchanged
    expect(mockStringLiteral2.value).toBe("class3 class4"); // Modified
    expect(mockStringLiteral2.raw).toBe('"class3 class4"'); // Modified
    expect(removeClassToken).toHaveBeenCalledWith("class3 target-class class4", "target-class");
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
    const { removeClassToken, createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    removeClassToken.mockReturnValue("");
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = removeValueFromStringLiteral(mockAST, 10, "any-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("");
    expect(mockStringLiteral.raw).toBe('""');
    expect(removeClassToken).toHaveBeenCalledWith("   \n\t  ", "any-class");
  });

  it("should handle removal of first class", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 35, ctxt: 0 },
      value: "target-class class2 class3",
      raw: '"target-class class2 class3"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { removeClassToken, createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    removeClassToken.mockReturnValue("class2 class3");
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = removeValueFromStringLiteral(mockAST, 10, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("class2 class3");
    expect(mockStringLiteral.raw).toBe('"class2 class3"');
  });

  it("should handle removal of last class", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 35, ctxt: 0 },
      value: "class1 class2 target-class",
      raw: '"class1 class2 target-class"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { removeClassToken, createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    removeClassToken.mockReturnValue("class1 class2");
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = removeValueFromStringLiteral(mockAST, 10, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("class1 class2");
    expect(mockStringLiteral.raw).toBe('"class1 class2"');
  });

  it("should handle special characters in class names", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 50, ctxt: 0 },
      value: "class1 target-class_with-special.chars class2",
      raw: '"class1 target-class_with-special.chars class2"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { removeClassToken, createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    removeClassToken.mockReturnValue("class1 class2");
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = removeValueFromStringLiteral(mockAST, 10, "target-class_with-special.chars");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("class1 class2");
    expect(mockStringLiteral.raw).toBe('"class1 class2"');
    expect(removeClassToken).toHaveBeenCalledWith(
      "class1 target-class_with-special.chars class2",
      "target-class_with-special.chars"
    );
  });

  it("should handle duplicate class names", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 40, ctxt: 0 },
      value: "class1 target-class class1 target-class",
      raw: '"class1 target-class class1 target-class"',
    };

    const mockTransformedAST = { ...mockAST };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    const { removeClassToken, createTransformedAST } = vi.mocked(await import("@ast/utils"));
    const { simple } = vi.mocked(await import("swc-walk"));

    isStringLiteral.mockReturnValue(true);
    removeClassToken.mockReturnValue("class1 class1"); // removeClassToken should handle duplicates
    createTransformedAST.mockReturnValue(mockTransformedAST);
    simple.mockImplementation((_ast, visitors) => {
      if (visitors.StringLiteral) {
        visitors.StringLiteral(mockStringLiteral, {});
      }
    });

    const result = removeValueFromStringLiteral(mockAST, 10, "target-class");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("class1 class1");
    expect(mockStringLiteral.raw).toBe('"class1 class1"');
  });
});
