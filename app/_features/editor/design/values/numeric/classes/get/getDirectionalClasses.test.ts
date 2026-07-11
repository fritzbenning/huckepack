import { describe, expect, it } from "vitest";
import { getDirectionalClasses } from "./getDirectionalClasses";

describe("getDirectionalClasses", () => {
  it("should generate directional classes with base classKey", () => {
    const result = getDirectionalClasses("p");
    expect(result).toEqual(["p", "px", "py", "pt", "pr", "pb", "pl"]);
  });

  it("should include base classKey first", () => {
    const result = getDirectionalClasses("m");
    expect(result[0]).toBe("m");
  });

  it("should generate all directional variants", () => {
    const result = getDirectionalClasses("gap");
    expect(result).toContain("gap");
    expect(result).toContain("gapx");
    expect(result).toContain("gapy");
    expect(result).toContain("gapt");
    expect(result).toContain("gapr");
    expect(result).toContain("gapb");
    expect(result).toContain("gapl");
  });

  it("should preserve order: base, x, y, t, r, b, l", () => {
    const result = getDirectionalClasses("p");
    expect(result).toEqual(["p", "px", "py", "pt", "pr", "pb", "pl"]);
  });

  it("should handle single character classKey", () => {
    const result = getDirectionalClasses("m");
    expect(result).toEqual(["m", "mx", "my", "mt", "mr", "mb", "ml"]);
  });

  it("should handle multi-character classKey", () => {
    const result = getDirectionalClasses("gap");
    expect(result).toEqual(["gap", "gapx", "gapy", "gapt", "gapr", "gapb", "gapl"]);
  });

  it("should handle classKey with dash", () => {
    const result = getDirectionalClasses("border-");
    expect(result).toEqual(["border-", "border-x", "border-y", "border-t", "border-r", "border-b", "border-l"]);
  });

  it("should always return 7 classes", () => {
    const result1 = getDirectionalClasses("p");
    const result2 = getDirectionalClasses("very-long-class-key");
    expect(result1).toHaveLength(7);
    expect(result2).toHaveLength(7);
  });
});

