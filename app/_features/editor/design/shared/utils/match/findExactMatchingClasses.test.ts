import { describe, expect, it } from "vitest";
import { findExactMatchingClasses } from "./findExactMatchingClasses";

describe("findExactMatchingClasses", () => {
  it("should find exact matching classes", () => {
    expect(findExactMatchingClasses(["flex", "items-center"], ["flex", "grid"])).toEqual(["flex"]);
  });

  it("should return empty array when no matches", () => {
    expect(findExactMatchingClasses(["flex", "items-center"], ["grid", "block"])).toEqual([]);
  });

  it("should find multiple matches", () => {
    expect(findExactMatchingClasses(["flex", "items-center", "grid"], ["flex", "grid", "block"])).toEqual([
      "flex",
      "grid",
    ]);
  });

  it("should handle empty classTokens", () => {
    expect(findExactMatchingClasses([], ["flex", "grid"])).toEqual([]);
  });

  it("should handle empty exactClasses", () => {
    expect(findExactMatchingClasses(["flex", "grid"], [])).toEqual([]);
  });

  it("should handle both empty", () => {
    expect(findExactMatchingClasses([], [])).toEqual([]);
  });

  it("should preserve order from exactClasses", () => {
    expect(findExactMatchingClasses(["b", "a", "c"], ["a", "b", "c"])).toEqual(["a", "b", "c"]);
  });

  it("should handle duplicate classes in classTokens", () => {
    expect(findExactMatchingClasses(["flex", "flex", "grid"], ["flex"])).toEqual(["flex"]);
  });

  it("should handle duplicate classes in exactClasses", () => {
    expect(findExactMatchingClasses(["flex"], ["flex", "flex"])).toEqual(["flex", "flex"]);
  });

  it("should handle partial matches correctly (should not match)", () => {
    expect(findExactMatchingClasses(["flex-col"], ["flex"])).toEqual([]);
    expect(findExactMatchingClasses(["flex"], ["flex-col"])).toEqual([]);
  });
});

