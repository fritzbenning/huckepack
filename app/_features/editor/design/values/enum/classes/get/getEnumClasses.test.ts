import { describe, expect, it } from "vitest";
import { getEnumClasses } from "../get/getEnumClasses";

describe("getEnumClasses", () => {
  it("should generate classes with prefix", () => {
    const result = getEnumClasses("flex", ["row", "col", "wrap"]);
    expect(result).toEqual(["flex-row", "flex-col", "flex-wrap"]);
  });

  it("should handle empty prefix", () => {
    const result = getEnumClasses("", ["row", "col"]);
    expect(result).toEqual(["row", "col"]);
  });

  it("should handle single value", () => {
    const result = getEnumClasses("flex", ["row"]);
    expect(result).toEqual(["flex-row"]);
  });

  it("should handle empty values array", () => {
    const result = getEnumClasses("flex", []);
    expect(result).toEqual([]);
  });

  it("should handle numeric values", () => {
    const result = getEnumClasses("gap", ["0", "1", "2"]);
    expect(result).toEqual(["gap-0", "gap-1", "gap-2"]);
  });

  it("should handle values with dashes", () => {
    const result = getEnumClasses("text", ["sm", "lg", "xl"]);
    expect(result).toEqual(["text-sm", "text-lg", "text-xl"]);
  });

  it("should handle prefix with trailing dash", () => {
    const result = getEnumClasses("flex-", ["row", "col"]);
    expect(result).toEqual(["flex--row", "flex--col"]);
  });

  it("should preserve order of values", () => {
    const result = getEnumClasses("justify", ["start", "center", "end"]);
    expect(result).toEqual(["justify-start", "justify-center", "justify-end"]);
  });

  it("should handle special characters in values", () => {
    const result = getEnumClasses("bg", ["red-500", "blue-600"]);
    expect(result).toEqual(["bg-red-500", "bg-blue-600"]);
  });

  it("should handle very long prefix", () => {
    const result = getEnumClasses("very-long-prefix-name", ["value"]);
    expect(result).toEqual(["very-long-prefix-name-value"]);
  });

  it("should handle values with spaces", () => {
    const result = getEnumClasses("text", ["sm", "lg"]);
    expect(result).toEqual(["text-sm", "text-lg"]);
  });
});
