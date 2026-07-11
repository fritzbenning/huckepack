import { describe, expect, it } from "vitest";
import { mapTypeToLiteralType } from "./mapTypeToLiteralType";

describe("mapTypeToLiteralType", () => {
  it("should map 'number' to NumericLiteral", () => {
    const result = mapTypeToLiteralType("number");
    expect(result).toBe("NumericLiteral");
  });

  it("should map 'NumericLiteral' to NumericLiteral", () => {
    const result = mapTypeToLiteralType("NumericLiteral");
    expect(result).toBe("NumericLiteral");
  });

  it("should map 'boolean' to BooleanLiteral", () => {
    const result = mapTypeToLiteralType("boolean");
    expect(result).toBe("BooleanLiteral");
  });

  it("should map 'BooleanLiteral' to BooleanLiteral", () => {
    const result = mapTypeToLiteralType("BooleanLiteral");
    expect(result).toBe("BooleanLiteral");
  });

  it("should map 'string' to StringLiteral", () => {
    const result = mapTypeToLiteralType("string");
    expect(result).toBe("StringLiteral");
  });

  it("should map 'StringLiteral' to StringLiteral", () => {
    const result = mapTypeToLiteralType("StringLiteral");
    expect(result).toBe("StringLiteral");
  });

  it("should default to StringLiteral for unknown types", () => {
    const result = mapTypeToLiteralType("unknown");
    expect(result).toBe("StringLiteral");
  });

  it("should default to StringLiteral for empty string", () => {
    const result = mapTypeToLiteralType("");
    expect(result).toBe("StringLiteral");
  });

  it("should default to StringLiteral for null", () => {
    const result = mapTypeToLiteralType(null as unknown as string);
    expect(result).toBe("StringLiteral");
  });

  it("should default to StringLiteral for undefined", () => {
    const result = mapTypeToLiteralType(undefined as unknown as string);
    expect(result).toBe("StringLiteral");
  });

  it("should be case sensitive for primitive types", () => {
    expect(mapTypeToLiteralType("Number")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("Boolean")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("String")).toBe("StringLiteral");
  });

  it("should be case sensitive for literal types", () => {
    expect(mapTypeToLiteralType("numericliteral")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("booleanliteral")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("stringliteral")).toBe("StringLiteral");
  });

  it("should handle complex type names", () => {
    expect(mapTypeToLiteralType("React.ComponentType")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("Array<string>")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("Promise<number>")).toBe("StringLiteral");
  });

  it("should handle TypeScript union types", () => {
    expect(mapTypeToLiteralType("string | number")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("boolean | null")).toBe("StringLiteral");
  });

  it("should handle object types", () => {
    expect(mapTypeToLiteralType("object")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("Object")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("{}")).toBe("StringLiteral");
  });

  it("should handle function types", () => {
    expect(mapTypeToLiteralType("function")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("Function")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("() => void")).toBe("StringLiteral");
  });

  it("should handle array types", () => {
    expect(mapTypeToLiteralType("array")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("Array")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("string[]")).toBe("StringLiteral");
  });

  it("should handle whitespace in type names", () => {
    expect(mapTypeToLiteralType(" number")).toBe("StringLiteral");
    expect(mapTypeToLiteralType("number ")).toBe("StringLiteral");
    expect(mapTypeToLiteralType(" boolean ")).toBe("StringLiteral");
  });
});
