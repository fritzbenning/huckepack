import { describe, expect, it } from "vitest";
import { createEnumClass } from "../create/createEnumClass";

describe("createEnumClass", () => {
  it("should create class with prefix", () => {
    const result = createEnumClass("auto", "bg");
    expect(result).toBe("bg-auto");
  });

  it("should return value when prefix is empty string", () => {
    const result = createEnumClass("static", "");
    expect(result).toBe("static");
  });

  it("should handle numeric values", () => {
    const result = createEnumClass("0", "gap");
    expect(result).toBe("gap-0");
  });

  it("should handle values with dashes", () => {
    const result = createEnumClass("red-500", "bg");
    expect(result).toBe("bg-red-500");
  });

  it("should handle single character values", () => {
    const result = createEnumClass("x", "flex");
    expect(result).toBe("flex-x");
  });

  it("should handle long values", () => {
    const result = createEnumClass("very-long-value-name", "prefix");
    expect(result).toBe("prefix-very-long-value-name");
  });

  it("should handle empty value with prefix", () => {
    const result = createEnumClass("", "bg");
    expect(result).toBe("bg-");
  });

  it("should handle empty value with empty prefix", () => {
    const result = createEnumClass("", "");
    expect(result).toBe("");
  });

  it("should handle special characters in value", () => {
    const result = createEnumClass("sm", "text");
    expect(result).toBe("text-sm");
  });

  it("should handle prefix with dash", () => {
    const result = createEnumClass("value", "prefix-");
    expect(result).toBe("prefix--value");
  });
});
