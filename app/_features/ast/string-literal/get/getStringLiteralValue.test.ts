import type { Expression } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getStringLiteralValue } from "./getStringLiteralValue";

// Mock dependencies
vi.mock("@ast/type-check", () => ({
  isStringLiteral: vi.fn(),
}));

describe("getStringLiteralValue", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return string value when node is StringLiteral", async () => {
    const mockStringLiteral: Expression = {
      type: "StringLiteral",
      span: { start: 0, end: 15, ctxt: 0 },
      value: "Hello, World!",
      raw: '"Hello, World!"',
    };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    isStringLiteral.mockReturnValue(true);

    const result = getStringLiteralValue(mockStringLiteral);

    expect(result).toBe("Hello, World!");
    expect(isStringLiteral).toHaveBeenCalledWith(mockStringLiteral);
  });

  it("should return empty string when node is not StringLiteral", async () => {
    const mockNumericLiteral: Expression = {
      type: "NumericLiteral",
      span: { start: 0, end: 3, ctxt: 0 },
      value: 123,
      raw: "123",
    };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    isStringLiteral.mockReturnValue(false);

    const result = getStringLiteralValue(mockNumericLiteral);

    expect(result).toBe("");
    expect(isStringLiteral).toHaveBeenCalledWith(mockNumericLiteral);
  });

  it("should return empty string value when StringLiteral has empty value", async () => {
    const mockEmptyStringLiteral: Expression = {
      type: "StringLiteral",
      span: { start: 0, end: 2, ctxt: 0 },
      value: "",
      raw: '""',
    };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    isStringLiteral.mockReturnValue(true);

    const result = getStringLiteralValue(mockEmptyStringLiteral);

    expect(result).toBe("");
    expect(isStringLiteral).toHaveBeenCalledWith(mockEmptyStringLiteral);
  });

  it("should handle StringLiteral with special characters", async () => {
    const mockStringLiteral: Expression = {
      type: "StringLiteral",
      span: { start: 0, end: 20, ctxt: 0 },
      value: "Line 1\nLine 2\tTabbed",
      raw: '"Line 1\\nLine 2\\tTabbed"',
    };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    isStringLiteral.mockReturnValue(true);

    const result = getStringLiteralValue(mockStringLiteral);

    expect(result).toBe("Line 1\nLine 2\tTabbed");
  });

  it("should handle StringLiteral with quotes in value", async () => {
    const mockStringLiteral: Expression = {
      type: "StringLiteral",
      span: { start: 0, end: 25, ctxt: 0 },
      value: 'He said "Hello" to me',
      raw: '"He said \\"Hello\\" to me"',
    };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    isStringLiteral.mockReturnValue(true);

    const result = getStringLiteralValue(mockStringLiteral);

    expect(result).toBe('He said "Hello" to me');
  });

  it("should handle BooleanLiteral node", async () => {
    const mockBooleanLiteral: Expression = {
      type: "BooleanLiteral",
      span: { start: 0, end: 4, ctxt: 0 },
      value: true,
    };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    isStringLiteral.mockReturnValue(false);

    const result = getStringLiteralValue(mockBooleanLiteral);

    expect(result).toBe("");
  });

  it("should handle Identifier node", async () => {
    const mockIdentifier: Expression = {
      type: "Identifier",
      span: { start: 0, end: 8, ctxt: 0 },
      value: "variable",
      optional: false,
    };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    isStringLiteral.mockReturnValue(false);

    const result = getStringLiteralValue(mockIdentifier);

    expect(result).toBe("");
  });

  it("should handle CallExpression node", async () => {
    const mockCallExpression: Expression = {
      type: "CallExpression",
      span: { start: 0, end: 15, ctxt: 0 },
      callee: {
        type: "Identifier",
        span: { start: 0, end: 8, ctxt: 0 },
        value: "someFunc",
        optional: false,
      },
      arguments: [],
    };

    const { isStringLiteral } = vi.mocked(await import("@ast/type-check"));
    isStringLiteral.mockReturnValue(false);

    const result = getStringLiteralValue(mockCallExpression);

    expect(result).toBe("");
  });
});