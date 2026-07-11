import type { BooleanLiteral, NumericLiteral, StringLiteral } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { createExpressionFromValue } from "./createExpressionFromValue";

describe("createExpressionFromValue", () => {
  it("should create string literal from string value", () => {
    const expression = createExpressionFromValue("Hello World") as StringLiteral;

    expect(expression.type).toBe("StringLiteral");
    expect(expression.value).toBe("Hello World");
    expect(expression.raw).toBe('"Hello World"');
  });

  it("should create numeric literal from number value", () => {
    const expression = createExpressionFromValue(42) as NumericLiteral;

    expect(expression.type).toBe("NumericLiteral");
    expect(expression.value).toBe(42);
    expect(expression.raw).toBe("42");
  });

  it("should create boolean literal from boolean value", () => {
    const expression = createExpressionFromValue(true) as BooleanLiteral;

    expect(expression.type).toBe("BooleanLiteral");
    expect(expression.value).toBe(true);
  });

  it("should create boolean literal from false value", () => {
    const expression = createExpressionFromValue(false) as BooleanLiteral;

    expect(expression.type).toBe("BooleanLiteral");
    expect(expression.value).toBe(false);
  });

  it("should create string literal from empty string", () => {
    const expression = createExpressionFromValue("") as StringLiteral;

    expect(expression.type).toBe("StringLiteral");
    expect(expression.value).toBe("");
    expect(expression.raw).toBe('""');
  });

  it("should create numeric literal from zero", () => {
    const expression = createExpressionFromValue(0) as NumericLiteral;

    expect(expression.type).toBe("NumericLiteral");
    expect(expression.value).toBe(0);
    expect(expression.raw).toBe("0");
  });

  it("should create numeric literal from negative number", () => {
    const expression = createExpressionFromValue(-123) as NumericLiteral;

    expect(expression.type).toBe("NumericLiteral");
    expect(expression.value).toBe(-123);
    expect(expression.raw).toBe("-123");
  });

  it("should create numeric literal from decimal number", () => {
    const expression = createExpressionFromValue(3.14) as NumericLiteral;

    expect(expression.type).toBe("NumericLiteral");
    expect(expression.value).toBe(3.14);
    expect(expression.raw).toBe("3.14");
  });

  it("should create string literal from string with special characters", () => {
    const expression = createExpressionFromValue("Hello\nWorld") as StringLiteral;

    expect(expression.type).toBe("StringLiteral");
    expect(expression.value).toBe("Hello\nWorld");
    expect(expression.raw).toBe('"Hello\nWorld"');
  });

  it("should create string literal from string with quotes", () => {
    const expression = createExpressionFromValue('Say "Hello"') as StringLiteral;

    expect(expression.type).toBe("StringLiteral");
    expect(expression.value).toBe('Say "Hello"');
    expect(expression.raw).toBe('"Say "Hello""');
  });

  it("should create numeric literal from infinity", () => {
    const expression = createExpressionFromValue(Infinity) as NumericLiteral;

    expect(expression.type).toBe("NumericLiteral");
    expect(expression.value).toBe(Infinity);
    expect(expression.raw).toBe("Infinity");
  });

  it("should create numeric literal from NaN", () => {
    const expression = createExpressionFromValue(NaN) as NumericLiteral;

    expect(expression.type).toBe("NumericLiteral");
    expect(expression.value).toBeNaN();
    expect(expression.raw).toBe("NaN");
  });

  it("should handle large numbers", () => {
    const expression = createExpressionFromValue(1000000) as NumericLiteral;

    expect(expression.type).toBe("NumericLiteral");
    expect(expression.value).toBe(1000000);
    expect(expression.raw).toBe("1000000");
  });

  it("should handle very small decimal numbers", () => {
    const expression = createExpressionFromValue(0.001) as NumericLiteral;

    expect(expression.type).toBe("NumericLiteral");
    expect(expression.value).toBe(0.001);
    expect(expression.raw).toBe("0.001");
  });
});
