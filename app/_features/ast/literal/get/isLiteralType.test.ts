import { describe, expect, it } from "vitest";
import { isLiteralType } from "./isLiteralType";

describe("isLiteralType", () => {
  it("should return true for StringLiteral", () => {
    const result = isLiteralType("StringLiteral");
    expect(result).toBe(true);
  });

  it("should return true for NumericLiteral", () => {
    const result = isLiteralType("NumericLiteral");
    expect(result).toBe(true);
  });

  it("should return true for BooleanLiteral", () => {
    const result = isLiteralType("BooleanLiteral");
    expect(result).toBe(true);
  });

  it("should return false for string", () => {
    const result = isLiteralType("string");
    expect(result).toBe(false);
  });

  it("should return false for number", () => {
    const result = isLiteralType("number");
    expect(result).toBe(false);
  });

  it("should return false for boolean", () => {
    const result = isLiteralType("boolean");
    expect(result).toBe(false);
  });

  it("should return false for empty string", () => {
    const result = isLiteralType("");
    expect(result).toBe(false);
  });

  it("should return false for null", () => {
    const result = isLiteralType(null as unknown as string);
    expect(result).toBe(false);
  });

  it("should return false for undefined", () => {
    const result = isLiteralType(undefined as unknown as string);
    expect(result).toBe(false);
  });

  it("should return false for random string", () => {
    const result = isLiteralType("RandomType");
    expect(result).toBe(false);
  });

  it("should be case sensitive", () => {
    expect(isLiteralType("stringliteral")).toBe(false);
    expect(isLiteralType("STRINGLITERAL")).toBe(false);
    expect(isLiteralType("stringLiteral")).toBe(false);
  });

  it("should return false for partial matches", () => {
    expect(isLiteralType("String")).toBe(false);
    expect(isLiteralType("Literal")).toBe(false);
    expect(isLiteralType("StringLiteral123")).toBe(false);
  });

  it("should return false for other AST node types", () => {
    expect(isLiteralType("Identifier")).toBe(false);
    expect(isLiteralType("JSXElement")).toBe(false);
    expect(isLiteralType("CallExpression")).toBe(false);
    expect(isLiteralType("FunctionDeclaration")).toBe(false);
  });

  it("should handle whitespace", () => {
    expect(isLiteralType(" StringLiteral")).toBe(false);
    expect(isLiteralType("StringLiteral ")).toBe(false);
    expect(isLiteralType(" StringLiteral ")).toBe(false);
  });
});
