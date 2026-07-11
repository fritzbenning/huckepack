import type { LiteralType } from "@ast/types";
import { describe, expect, it } from "vitest";
import { createLiteral } from "./createLiteral";

describe("createLiteral", () => {
  it("should create a string literal", () => {
    const literal = createLiteral("hello", "StringLiteral");

    expect(literal.type).toBe("StringLiteral");
    expect(literal.value).toBe("hello");
  });

  it("should create a numeric literal", () => {
    const literal = createLiteral(42, "NumericLiteral");

    expect(literal.type).toBe("NumericLiteral");
    expect(literal.value).toBe(42);
  });

  it("should create a boolean literal", () => {
    const literal = createLiteral(true, "BooleanLiteral");

    expect(literal.type).toBe("BooleanLiteral");
    expect(literal.value).toBe(true);
  });

  it("should throw error for unsupported literal type", () => {
    expect(() => {
      createLiteral("test", "UnsupportedType" as unknown as LiteralType);
    }).toThrow("Unsupported literal type");
  });
});
