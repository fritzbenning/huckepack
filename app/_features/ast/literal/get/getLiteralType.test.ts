import { describe, expect, it } from "vitest";
import { getLiteralType } from "./getLiteralType";

describe("getLiteralType", () => {
  it("should return StringLiteral for StringLiteral type", () => {
    const result = getLiteralType("StringLiteral");
    expect(result).toBe("StringLiteral");
  });

  it("should return NumericLiteral for NumericLiteral type", () => {
    const result = getLiteralType("NumericLiteral");
    expect(result).toBe("NumericLiteral");
  });

  it("should return BooleanLiteral for BooleanLiteral type", () => {
    const result = getLiteralType("BooleanLiteral");
    expect(result).toBe("BooleanLiteral");
  });

  it("should map 'string' to StringLiteral", () => {
    const result = getLiteralType("string");
    expect(result).toBe("StringLiteral");
  });

  it("should map 'number' to NumericLiteral", () => {
    const result = getLiteralType("number");
    expect(result).toBe("NumericLiteral");
  });

  it("should map 'boolean' to BooleanLiteral", () => {
    const result = getLiteralType("boolean");
    expect(result).toBe("BooleanLiteral");
  });

  it("should default to StringLiteral for unknown types", () => {
    const result = getLiteralType("unknown");
    expect(result).toBe("StringLiteral");
  });

  it("should default to StringLiteral for empty string", () => {
    const result = getLiteralType("");
    expect(result).toBe("StringLiteral");
  });

  it("should use fallback type when provided", () => {
    const result = getLiteralType("unknown", "number");
    expect(result).toBe("NumericLiteral");
  });

  it("should use fallback type for boolean", () => {
    const result = getLiteralType("invalid", "boolean");
    expect(result).toBe("BooleanLiteral");
  });

  it("should prefer main type over fallback when main type is valid", () => {
    const result = getLiteralType("StringLiteral", "number");
    expect(result).toBe("StringLiteral");
  });

  it("should handle case sensitivity", () => {
    const result = getLiteralType("stringliteral");
    expect(result).toBe("StringLiteral"); // Should default since case doesn't match
  });

  it("should handle null/undefined fallback", () => {
    const result = getLiteralType("unknown", undefined);
    expect(result).toBe("StringLiteral");
  });

  it("should map fallback NumericLiteral correctly", () => {
    const result = getLiteralType("invalid", "NumericLiteral");
    expect(result).toBe("NumericLiteral");
  });

  it("should map fallback BooleanLiteral correctly", () => {
    const result = getLiteralType("invalid", "BooleanLiteral");
    expect(result).toBe("BooleanLiteral");
  });

  it("should handle complex type names", () => {
    const result = getLiteralType("React.ComponentType<Props>");
    expect(result).toBe("StringLiteral");
  });
});
