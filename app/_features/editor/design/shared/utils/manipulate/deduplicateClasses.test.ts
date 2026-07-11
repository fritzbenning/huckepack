import { describe, expect, it } from "vitest";
import { deduplicateClasses } from "./deduplicateClasses";

describe("deduplicateClasses", () => {
  it("should deduplicate classes from single array", () => {
    expect(deduplicateClasses(["a", "b", "a", "c"])).toEqual(["a", "b", "c"]);
  });

  it("should deduplicate classes from multiple arrays", () => {
    expect(deduplicateClasses(["a", "b"], ["b", "c"], ["a", "d"])).toEqual(["a", "b", "c", "d"]);
  });

  it("should handle empty arrays", () => {
    expect(deduplicateClasses([])).toEqual([]);
  });

  it("should handle multiple empty arrays", () => {
    expect(deduplicateClasses([], [], [])).toEqual([]);
  });

  it("should handle mixed empty and non-empty arrays", () => {
    expect(deduplicateClasses([], ["a", "b"], [])).toEqual(["a", "b"]);
  });

  it("should preserve order of first occurrence", () => {
    expect(deduplicateClasses(["a", "b"], ["c", "a"], ["b", "d"])).toEqual(["a", "b", "c", "d"]);
  });

  it("should handle single class", () => {
    expect(deduplicateClasses(["a"])).toEqual(["a"]);
  });

  it("should handle all duplicates", () => {
    expect(deduplicateClasses(["a", "a", "a"], ["a", "a"])).toEqual(["a"]);
  });

  it("should handle no arguments", () => {
    expect(deduplicateClasses()).toEqual([]);
  });

  it("should handle classes with special characters", () => {
    expect(deduplicateClasses(["w-10", "h-20"], ["w-10", "p-4"])).toEqual(["w-10", "h-20", "p-4"]);
  });
});

