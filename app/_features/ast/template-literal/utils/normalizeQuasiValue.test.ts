import { describe, expect, it } from "vitest";
import { normalizeQuasiValue } from "./normalizeQuasiValue";

describe("normalizeQuasiValue", () => {
  it("should normalize whitespace by joining with single spaces", () => {
    const result = normalizeQuasiValue("  hello    world  \n  test  ");
    expect(result).toBe("hello world test");
  });

  it("should handle empty string", () => {
    const result = normalizeQuasiValue("");
    expect(result).toBe("");
  });

  it("should handle whitespace-only string", () => {
    const result = normalizeQuasiValue("   \n\t  ");
    expect(result).toBe("");
  });

  it("should handle single word", () => {
    const result = normalizeQuasiValue("hello");
    expect(result).toBe("hello");
  });

  it("should handle single word with whitespace", () => {
    const result = normalizeQuasiValue("  hello  ");
    expect(result).toBe("hello");
  });

  it("should add leading space when hasPrecedingExpression is true", () => {
    const result = normalizeQuasiValue("hello world", { hasPrecedingExpression: true });
    expect(result).toBe(" hello world");
  });

  it("should add trailing space when hasFollowingExpression is true", () => {
    const result = normalizeQuasiValue("hello world", { hasFollowingExpression: true });
    expect(result).toBe("hello world ");
  });

  it("should add both leading and trailing spaces when both expressions are present", () => {
    const result = normalizeQuasiValue("hello world", { 
      hasPrecedingExpression: true, 
      hasFollowingExpression: true 
    });
    expect(result).toBe(" hello world ");
  });

  it("should return single space when empty and between two expressions", () => {
    const result = normalizeQuasiValue("", { 
      hasPrecedingExpression: true, 
      hasFollowingExpression: true 
    });
    expect(result).toBe(" ");
  });

  it("should return single space when whitespace-only and between two expressions", () => {
    const result = normalizeQuasiValue("   \n\t  ", { 
      hasPrecedingExpression: true, 
      hasFollowingExpression: true 
    });
    expect(result).toBe(" ");
  });

  it("should return single space when empty and has preceding expression", () => {
    const result = normalizeQuasiValue("", { hasPrecedingExpression: true });
    expect(result).toBe(" ");
  });

  it("should return single space when empty and has following expression", () => {
    const result = normalizeQuasiValue("", { hasFollowingExpression: true });
    expect(result).toBe(" ");
  });

  it("should return single space when whitespace-only and has preceding expression", () => {
    const result = normalizeQuasiValue("   \n\t  ", { hasPrecedingExpression: true });
    expect(result).toBe(" ");
  });

  it("should return single space when whitespace-only and has following expression", () => {
    const result = normalizeQuasiValue("   \n\t  ", { hasFollowingExpression: true });
    expect(result).toBe(" ");
  });

  it("should handle newlines and tabs in content", () => {
    const result = normalizeQuasiValue("hello\n\tworld\n  test");
    expect(result).toBe("hello world test");
  });

  it("should handle multiple consecutive spaces", () => {
    const result = normalizeQuasiValue("hello     world");
    expect(result).toBe("hello world");
  });

  it("should handle mixed whitespace characters", () => {
    const result = normalizeQuasiValue("hello \t\n world \r\n test");
    expect(result).toBe("hello world test");
  });

  it("should preserve content with leading space when hasPrecedingExpression", () => {
    const result = normalizeQuasiValue("  hello  world  ", { hasPrecedingExpression: true });
    expect(result).toBe(" hello world");
  });

  it("should preserve content with trailing space when hasFollowingExpression", () => {
    const result = normalizeQuasiValue("  hello  world  ", { hasFollowingExpression: true });
    expect(result).toBe("hello world ");
  });

  it("should handle complex whitespace normalization with expressions", () => {
    const result = normalizeQuasiValue("\n  hello\t\t\nworld   \n", { 
      hasPrecedingExpression: true, 
      hasFollowingExpression: true 
    });
    expect(result).toBe(" hello world ");
  });

  it("should handle single character content", () => {
    const result = normalizeQuasiValue("a");
    expect(result).toBe("a");
  });

  it("should handle single character with expressions", () => {
    const result = normalizeQuasiValue("a", { 
      hasPrecedingExpression: true, 
      hasFollowingExpression: true 
    });
    expect(result).toBe(" a ");
  });

  it("should handle content that becomes empty after normalization", () => {
    const result = normalizeQuasiValue("     ");
    expect(result).toBe("");
  });

  it("should handle content with only special whitespace characters", () => {
    const result = normalizeQuasiValue("\n\r\t\f\v");
    expect(result).toBe("");
  });

  it("should handle default options when none provided", () => {
    const result = normalizeQuasiValue("hello world");
    expect(result).toBe("hello world");
  });

  it("should handle partial options object", () => {
    const result1 = normalizeQuasiValue("hello world", { hasPrecedingExpression: true });
    expect(result1).toBe(" hello world");

    const result2 = normalizeQuasiValue("hello world", { hasFollowingExpression: true });
    expect(result2).toBe("hello world ");
  });

  it("should handle explicit false values in options", () => {
    const result = normalizeQuasiValue("hello world", { 
      hasPrecedingExpression: false, 
      hasFollowingExpression: false 
    });
    expect(result).toBe("hello world");
  });
});