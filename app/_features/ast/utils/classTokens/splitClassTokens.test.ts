import { describe, expect, it } from "vitest";
import { splitClassTokens } from "./splitClassTokens";

describe("splitClassTokens", () => {
  it("should split string by whitespace", () => {
    const result = splitClassTokens("class1 class2 class3");
    expect(result).toEqual(["class1", "class2", "class3"]);
  });

  it("should handle single class", () => {
    const result = splitClassTokens("single-class");
    expect(result).toEqual(["single-class"]);
  });

  it("should handle empty string", () => {
    const result = splitClassTokens("");
    expect(result).toEqual([]);
  });

  it("should handle whitespace-only string", () => {
    const result = splitClassTokens("   \n\t  ");
    expect(result).toEqual([]);
  });

  it("should handle multiple consecutive spaces", () => {
    const result = splitClassTokens("class1    class2   class3");
    expect(result).toEqual(["class1", "class2", "class3"]);
  });

  it("should handle leading and trailing spaces", () => {
    const result = splitClassTokens("  class1 class2  ");
    expect(result).toEqual(["class1", "class2"]);
  });

  it("should handle tabs and newlines", () => {
    const result = splitClassTokens("class1\tclass2\nclass3");
    expect(result).toEqual(["class1", "class2", "class3"]);
  });

  it("should handle mixed whitespace characters", () => {
    const result = splitClassTokens("class1 \t\n class2 \r\n class3");
    expect(result).toEqual(["class1", "class2", "class3"]);
  });

  it("should handle class names with special characters", () => {
    const result = splitClassTokens("class-with-dashes class_with_underscores class.with.dots");
    expect(result).toEqual(["class-with-dashes", "class_with_underscores", "class.with.dots"]);
  });

  it("should handle numeric class names", () => {
    const result = splitClassTokens("text-lg 2xl 3xl font-bold");
    expect(result).toEqual(["text-lg", "2xl", "3xl", "font-bold"]);
  });

  it("should handle duplicate class names", () => {
    const result = splitClassTokens("class1 class2 class1 class2");
    expect(result).toEqual(["class1", "class2", "class1", "class2"]);
  });

  it("should handle very long strings", () => {
    const longString = Array.from({ length: 100 }, (_, i) => `class${i}`).join(" ");
    const expected = Array.from({ length: 100 }, (_, i) => `class${i}`);
    const result = splitClassTokens(longString);
    expect(result).toEqual(expected);
  });

  it("should handle single character classes", () => {
    const result = splitClassTokens("a b c d");
    expect(result).toEqual(["a", "b", "c", "d"]);
  });

  it("should handle classes with numbers", () => {
    const result = splitClassTokens("col-1 col-2 col-12 grid-cols-3");
    expect(result).toEqual(["col-1", "col-2", "col-12", "grid-cols-3"]);
  });

  it("should handle classes with slashes", () => {
    const result = splitClassTokens("w-1/2 w-1/3 w-2/3 w-1/4");
    expect(result).toEqual(["w-1/2", "w-1/3", "w-2/3", "w-1/4"]);
  });

  it("should handle classes with brackets", () => {
    const result = splitClassTokens("text-[14px] bg-[#ff0000] w-[100px]");
    expect(result).toEqual(["text-[14px]", "bg-[#ff0000]", "w-[100px]"]);
  });

  it("should handle classes with colons", () => {
    const result = splitClassTokens("hover:bg-blue-500 focus:ring-2 sm:text-lg");
    expect(result).toEqual(["hover:bg-blue-500", "focus:ring-2", "sm:text-lg"]);
  });

  it("should handle empty tokens between multiple spaces", () => {
    const result = splitClassTokens("class1     class2");
    expect(result).toEqual(["class1", "class2"]);
  });

  it("should handle form feed and vertical tab", () => {
    const result = splitClassTokens("class1\fclass2\vclass3");
    expect(result).toEqual(["class1", "class2", "class3"]);
  });

  it("should handle non-breaking space", () => {
    const result = splitClassTokens("class1\u00A0class2");
    expect(result).toEqual(["class1", "class2"]);
  });

  it("should handle zero-width space", () => {
    const result = splitClassTokens("class1\u200Bclass2");
    expect(result).toEqual(["class1\u200Bclass2"]); // Zero-width space is not considered whitespace by \s+
  });

  it("should handle unicode whitespace", () => {
    const result = splitClassTokens("class1\u2000class2\u2001class3");
    expect(result).toEqual(["class1", "class2", "class3"]);
  });

  it("should handle very complex class names", () => {
    const result = splitClassTokens("before:content-[''] after:content-['→'] group-hover:translate-x-1");
    expect(result).toEqual(["before:content-['']", "after:content-['→']", "group-hover:translate-x-1"]);
  });

  it("should handle string with only one space", () => {
    const result = splitClassTokens(" ");
    expect(result).toEqual([]);
  });

  it("should handle string with mixed empty and non-empty tokens", () => {
    // This tests the filter(Boolean) part
    const result = splitClassTokens("class1  class2");
    expect(result).toEqual(["class1", "class2"]);
  });
});