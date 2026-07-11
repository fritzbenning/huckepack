import { describe, expect, it } from "vitest";
import { findMatchingPair } from "./findMatchingPair";

describe("findMatchingPair", () => {
  it("should find matching height class for width class", () => {
    const classes = ["w-10", "h-10", "p-4"];
    const result = findMatchingPair(classes, "w-10", "h");
    expect(result).toBe("h-10");
  });

  it("should find matching width class for height class", () => {
    const classes = ["w-20", "h-20", "m-2"];
    const result = findMatchingPair(classes, "h-20", "w");
    expect(result).toBe("w-20");
  });

  it("should return null when no matching pair exists", () => {
    const classes = ["w-10", "h-20", "p-4"];
    const result = findMatchingPair(classes, "w-10", "h");
    expect(result).toBeNull();
  });

  it("should return null for variant prefixes (not fully supported)", () => {
    const classes = ["md:w-10", "md:h-10", "w-10"];
    const result = findMatchingPair(classes, "md:w-10", "h");
    expect(result).toBeNull();
  });

  it("should return null for class without suffix", () => {
    const classes = ["w", "h-10"];
    const result = findMatchingPair(classes, "w", "h");
    expect(result).toBeNull();
  });

  it("should handle empty classes array", () => {
    const result = findMatchingPair([], "w-10", "h");
    expect(result).toBeNull();
  });

  it("should handle class that doesn't start with w- or h-", () => {
    const classes = ["p-4", "m-2"];
    const result = findMatchingPair(classes, "p-4", "h");
    expect(result).toBeNull();
  });
});

