
import { describe, it, expect } from "vitest";
import { getExpressionSpan } from "./getExpressionSpan";
import type { Expression, Span } from "@swc/wasm-web";

describe("getExpressionSpan", () => {
  it("should return span when expression has a valid span", () => {
    const validSpan: Span = { start: 10, end: 20, ctxt: 0 };
    const mockExpr = { span: validSpan } as unknown as Expression;

    const result = getExpressionSpan(mockExpr);

    expect(result).toEqual(validSpan);
  });

  it("should return null when expression span is zero/empty", () => {
    const emptySpan: Span = { start: 0, end: 0, ctxt: 0 };
    const mockExpr = { span: emptySpan } as unknown as Expression;

    const result = getExpressionSpan(mockExpr);

    expect(result).toBeNull();
  });

  it("should return null when expression has no span property (defaults to empty)", () => {
    const mockExpr = {} as unknown as Expression;

    const result = getExpressionSpan(mockExpr);

    expect(result).toBeNull();
  });
});
