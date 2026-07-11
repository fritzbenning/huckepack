import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { replaceStringLiteral } from "./replaceStringLiteral";

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

describe("replaceStringLiteral", () => {
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

  it("should replace string literal value and raw at matching span", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "old value",
      raw: '"old value"',
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

    const result = replaceStringLiteral(mockAST, 10, "new value");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("new value");
    expect(mockStringLiteral.raw).toBe('"new value"');
    expect(createTransformedAST).toHaveBeenCalledWith(mockAST);
    expect(simple).toHaveBeenCalledWith(mockTransformedAST, expect.any(Object));
  });

  it("should not replace string literal when span doesn't match", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 999, end: 1010, ctxt: 0 }, // Different span
      value: "old value",
      raw: '"old value"',
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

    const result = replaceStringLiteral(mockAST, 10, "new value");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("old value"); // Unchanged
    expect(mockStringLiteral.raw).toBe('"old value"'); // Unchanged
  });

  it("should not replace when node is not a string literal", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "old value",
      raw: '"old value"',
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

    const result = replaceStringLiteral(mockAST, 10, "new value");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("old value"); // Unchanged
    expect(mockStringLiteral.raw).toBe('"old value"'); // Unchanged
  });

  it("should handle empty string replacement", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "old value",
      raw: '"old value"',
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

    const result = replaceStringLiteral(mockAST, 10, "");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("");
    expect(mockStringLiteral.raw).toBe('""');
  });

  it("should handle string with special characters", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "old value",
      raw: '"old value"',
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

    const result = replaceStringLiteral(mockAST, 10, "Line 1\nLine 2\tTabbed");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe("Line 1\nLine 2\tTabbed");
    expect(mockStringLiteral.raw).toBe('"Line 1\nLine 2\tTabbed"');
  });

  it("should handle string with quotes", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "old value",
      raw: '"old value"',
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

    const result = replaceStringLiteral(mockAST, 10, 'He said "Hello"');

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe('He said "Hello"');
    expect(mockStringLiteral.raw).toBe('"He said "Hello""');
  });

  it("should handle multiple string literals with same span", async () => {
    const mockStringLiteral1 = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "first value",
      raw: '"first value"',
    };

    const mockStringLiteral2 = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "second value",
      raw: '"second value"',
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

    const result = replaceStringLiteral(mockAST, 10, "new value");

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral1.value).toBe("new value");
    expect(mockStringLiteral1.raw).toBe('"new value"');
    expect(mockStringLiteral2.value).toBe("new value");
    expect(mockStringLiteral2.raw).toBe('"new value"');
  });

  it("should handle long string replacement", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 25, ctxt: 0 },
      value: "short",
      raw: '"short"',
    };

    const mockTransformedAST = { ...mockAST };
    const longString = "This is a very long string that contains multiple words and should be handled correctly";

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

    const result = replaceStringLiteral(mockAST, 10, longString);

    expect(result).toBe(mockTransformedAST);
    expect(mockStringLiteral.value).toBe(longString);
    expect(mockStringLiteral.raw).toBe(`"${longString}"`);
  });
});
