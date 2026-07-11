import { describe, expect, it } from "vitest";
import { createBooleanLiteral } from "./createBooleanLiteral";

describe("createBooleanLiteral", () => {
  it("should create boolean literal with true value", () => {
    const literal = createBooleanLiteral(true);

    expect(literal.type).toBe("BooleanLiteral");
    expect(literal.value).toBe(true);
    expect(literal.span).toBeDefined();
    expect(literal.span.end - literal.span.start).toBe("true".length);
  });

  it("should create boolean literal with false value", () => {
    const literal = createBooleanLiteral(false);

    expect(literal.type).toBe("BooleanLiteral");
    expect(literal.value).toBe(false);
    expect(literal.span).toBeDefined();
    expect(literal.span.end - literal.span.start).toBe("false".length);
  });

  it("should have correct span length for true", () => {
    const literal = createBooleanLiteral(true);

    expect(literal.span.end - literal.span.start).toBe(4); // "true" has 4 characters
  });

  it("should have correct span length for false", () => {
    const literal = createBooleanLiteral(false);

    expect(literal.span.end - literal.span.start).toBe(5); // "false" has 5 characters
  });

  it("should create different spans for different values", () => {
    const trueLiteral = createBooleanLiteral(true);
    const falseLiteral = createBooleanLiteral(false);

    expect(trueLiteral.span.end - trueLiteral.span.start).not.toBe(falseLiteral.span.end - falseLiteral.span.start);
  });

  it("should handle multiple calls independently", () => {
    const literal1 = createBooleanLiteral(true);
    const literal2 = createBooleanLiteral(true);

    expect(literal1.value).toBe(literal2.value);
    expect(literal1.type).toBe(literal2.type);
    expect(literal1).not.toBe(literal2); // Should be different objects
  });

  it("should preserve boolean type exactly", () => {
    const trueLiteral = createBooleanLiteral(true);
    const falseLiteral = createBooleanLiteral(false);

    expect(typeof trueLiteral.value).toBe("boolean");
    expect(typeof falseLiteral.value).toBe("boolean");
    expect(trueLiteral.value).toBe(true);
    expect(falseLiteral.value).toBe(false);
  });
});
