import type { Module } from "@swc/wasm-web";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { replaceLiteral } from "./replaceLiteral";

// Mock dependencies
vi.mock("@ast/utils", () => ({
  transformAST: vi.fn(),
}));

describe("replaceLiteral", () => {
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

  it("should replace StringLiteral value and raw", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      value: "oldValue",
      raw: '"oldValue"',
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.StringLiteral as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockStringLiteral);
      return { ast: { ...ast }, found: !!result };
    });

    const result = replaceLiteral(mockAST, 10, "newValue", "StringLiteral");

    expect(result).not.toBeNull();
    expect(mockStringLiteral.value).toBe("newValue");
    expect(mockStringLiteral.raw).toBe('"newValue"');
    expect(transformAST).toHaveBeenCalledWith(mockAST, expect.any(Object));
  });

  it("should replace NumericLiteral value and raw", async () => {
    const mockNumericLiteral = {
      type: "NumericLiteral" as const,
      span: { start: 15, end: 25, ctxt: 0 },
      value: 42,
      raw: "42",
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.NumericLiteral as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockNumericLiteral);
      return { ast: { ...ast }, found: !!result };
    });

    const result = replaceLiteral(mockAST, 15, 100, "NumericLiteral");

    expect(result).not.toBeNull();
    expect(mockNumericLiteral.value).toBe(100);
    expect(mockNumericLiteral.raw).toBe("100");
  });

  it("should replace BooleanLiteral with boolean value", async () => {
    const mockBooleanLiteral = {
      type: "BooleanLiteral" as const,
      span: { start: 20, end: 25, ctxt: 0 },
      value: false,
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.BooleanLiteral as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockBooleanLiteral);
      return { ast: { ...ast }, found: !!result };
    });

    const result = replaceLiteral(mockAST, 20, true, "BooleanLiteral");

    expect(result).not.toBeNull();
    expect(mockBooleanLiteral.value).toBe(true);
  });

  it("should replace BooleanLiteral with string 'true'", async () => {
    const mockBooleanLiteral = {
      type: "BooleanLiteral" as const,
      span: { start: 20, end: 25, ctxt: 0 },
      value: false,
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.BooleanLiteral as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockBooleanLiteral);
      return { ast: { ...ast }, found: !!result };
    });

    const result = replaceLiteral(mockAST, 20, "true", "BooleanLiteral");

    expect(result).not.toBeNull();
    expect(mockBooleanLiteral.value).toBe(true);
  });

  it("should replace BooleanLiteral with string 'false'", async () => {
    const mockBooleanLiteral = {
      type: "BooleanLiteral",
      span: { start: 20, end: 25, ctxt: 0 },
      value: true,
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.BooleanLiteral as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockBooleanLiteral);
      return { ast: { ...ast }, found: !!result };
    });

    const result = replaceLiteral(mockAST, 20, "false", "BooleanLiteral");

    expect(result).not.toBeNull();
    expect(mockBooleanLiteral.value).toBe(false);
  });

  it("should replace BooleanLiteral with number 1 as true", async () => {
    const mockBooleanLiteral = {
      type: "BooleanLiteral" as const,
      span: { start: 20, end: 25, ctxt: 0 },
      value: false,
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.BooleanLiteral as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockBooleanLiteral);
      return { ast: { ...ast }, found: !!result };
    });

    const result = replaceLiteral(mockAST, 20, 1, "BooleanLiteral");

    expect(result).not.toBeNull();
    expect(mockBooleanLiteral.value).toBe(true);
  });

  it("should replace BooleanLiteral with number 0 as false", async () => {
    const mockBooleanLiteral = {
      type: "BooleanLiteral",
      span: { start: 20, end: 25, ctxt: 0 },
      value: true,
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.BooleanLiteral as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockBooleanLiteral);
      return { ast: { ...ast }, found: !!result };
    });

    const result = replaceLiteral(mockAST, 20, 0, "BooleanLiteral");

    expect(result).not.toBeNull();
    expect(mockBooleanLiteral.value).toBe(false);
  });

  it("should not replace StringLiteral when span doesn't match", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      value: "oldValue",
      raw: '"oldValue"',
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.StringLiteral as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockStringLiteral);
      return { ast: { ...ast }, found: !!result };
    });

    const result = replaceLiteral(mockAST, 999, "newValue", "StringLiteral");

    expect(result).not.toBeNull();
    expect(mockStringLiteral.value).toBe("oldValue");
    expect(mockStringLiteral.raw).toBe('"oldValue"');
  });

  it("should not replace StringLiteral when type doesn't match", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      value: "oldValue",
      raw: '"oldValue"',
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.StringLiteral as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockStringLiteral);
      return { ast: { ...ast }, found: !!result };
    });

    const result = replaceLiteral(mockAST, 10, "newValue", "NumericLiteral");

    expect(result).not.toBeNull();
    expect(mockStringLiteral.value).toBe("oldValue");
    expect(mockStringLiteral.raw).toBe('"oldValue"');
  });

  it("should log error when literal is not found", async () => {
    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockReturnValue({ ast: mockAST, found: false });

    const result = replaceLiteral(mockAST, 999, "newValue", "StringLiteral");

    expect(result).toBe(mockAST);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Literal not found at start 999 with type StringLiteral");
  });

  it("should handle string conversion for numeric literal", async () => {
    const mockNumericLiteral = {
      type: "NumericLiteral" as const,
      span: { start: 15, end: 25, ctxt: 0 },
      value: 42,
      raw: "42",
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.NumericLiteral as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockNumericLiteral);
      return { ast: { ...ast }, found: !!result };
    });

    const result = replaceLiteral(mockAST, 15, "123", "NumericLiteral");

    expect(result).not.toBeNull();
    expect(mockNumericLiteral.value).toBe(123);
    expect(mockNumericLiteral.raw).toBe("123");
  });

  it("should handle boolean conversion for string literal", async () => {
    const mockStringLiteral = {
      type: "StringLiteral" as const,
      span: { start: 10, end: 20, ctxt: 0 },
      value: "oldValue",
      raw: '"oldValue"',
    };

    const { transformAST } = vi.mocked(await import("@ast/utils"));
    transformAST.mockImplementation((ast, visitors) => {
      const visitorFn = visitors.StringLiteral as ((node: unknown) => unknown) | undefined;
      const result = visitorFn?.(mockStringLiteral);
      return { ast: { ...ast }, found: !!result };
    });

    const result = replaceLiteral(mockAST, 10, true, "StringLiteral");

    expect(result).not.toBeNull();
    expect(mockStringLiteral.value).toBe("true");
    expect(mockStringLiteral.raw).toBe('"true"');
  });
});
