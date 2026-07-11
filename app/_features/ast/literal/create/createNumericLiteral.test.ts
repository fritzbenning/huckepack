import { describe, expect, it } from "vitest";
import { createNumericLiteral } from "./createNumericLiteral";

describe("createNumericLiteral", () => {
  it("should create numeric literal with positive integer", () => {
    const literal = createNumericLiteral(42);

    expect(literal.type).toBe("NumericLiteral");
    expect(literal.value).toBe(42);
    expect(literal.raw).toBe("42");
    expect(literal.span).toBeDefined();
    expect(literal.span.end - literal.span.start).toBe("42".length);
  });

  it("should create numeric literal with zero", () => {
    const literal = createNumericLiteral(0);

    expect(literal.value).toBe(0);
    expect(literal.raw).toBe("0");
    expect(literal.span.end - literal.span.start).toBe("0".length);
  });

  it("should create numeric literal with negative integer", () => {
    const literal = createNumericLiteral(-123);

    expect(literal.value).toBe(-123);
    expect(literal.raw).toBe("-123");
    expect(literal.span.end - literal.span.start).toBe("-123".length);
  });

  it("should create numeric literal with positive decimal", () => {
    const literal = createNumericLiteral(Math.PI);

    expect(literal.value).toBe(Math.PI);
    expect(literal.raw).toBe("3.141592653589793");
    expect(literal.span.end - literal.span.start).toBe("3.141592653589793".length);
  });

  it("should create numeric literal with negative decimal", () => {
    const literal = createNumericLiteral(-Math.E);

    expect(literal.value).toBe(-Math.E);
    expect(literal.raw).toBe("-2.718281828459045");
    expect(literal.span.end - literal.span.start).toBe("-2.718281828459045".length);
  });

  it("should create numeric literal with very small decimal", () => {
    const literal = createNumericLiteral(0.001);

    expect(literal.value).toBe(0.001);
    expect(literal.raw).toBe("0.001");
  });

  it("should create numeric literal with very large number", () => {
    const literal = createNumericLiteral(1000000);

    expect(literal.value).toBe(1000000);
    expect(literal.raw).toBe("1000000");
  });

  it("should create numeric literal with scientific notation input", () => {
    const literal = createNumericLiteral(1e6);

    expect(literal.value).toBe(1000000);
    expect(literal.raw).toBe("1000000"); // Should convert to regular notation
  });

  it("should create numeric literal with infinity", () => {
    const literal = createNumericLiteral(Infinity);

    expect(literal.value).toBe(Infinity);
    expect(literal.raw).toBe("Infinity");
  });

  it("should create numeric literal with negative infinity", () => {
    const literal = createNumericLiteral(-Infinity);

    expect(literal.value).toBe(-Infinity);
    expect(literal.raw).toBe("-Infinity");
  });

  it("should handle NaN", () => {
    const literal = createNumericLiteral(NaN);

    expect(literal.value).toBeNaN();
    expect(literal.raw).toBe("NaN");
  });

  it("should create numeric literal with single digit", () => {
    const literal = createNumericLiteral(7);

    expect(literal.value).toBe(7);
    expect(literal.raw).toBe("7");
    expect(literal.span.end - literal.span.start).toBe(1);
  });

  it("should create numeric literal with decimal starting with zero", () => {
    const literal = createNumericLiteral(0.5);

    expect(literal.value).toBe(0.5);
    expect(literal.raw).toBe("0.5");
  });
});
