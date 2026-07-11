import { describe, expect, it } from "vitest";
import { hasExpandedClasses } from "./hasExpandedClasses";

describe("hasExpandedClasses", () => {
  it("should return true when classTokens contains class starting with prefix", () => {
    expect(hasExpandedClasses(["p-4", "m-2"], ["p"])).toBe(true);
    expect(hasExpandedClasses(["pt-4", "pb-2"], ["p"])).toBe(true);
  });

  it("should return false when classTokens is null", () => {
    expect(hasExpandedClasses(null, ["p"])).toBe(false);
  });

  it("should return false when prefixes array is empty", () => {
    expect(hasExpandedClasses(["p-4"], [])).toBe(false);
  });

  it("should return false when no class matches any prefix", () => {
    expect(hasExpandedClasses(["other-class"], ["p", "m"])).toBe(false);
  });

  it("should return true when multiple prefixes match", () => {
    expect(hasExpandedClasses(["p-4"], ["p", "m"])).toBe(true);
    expect(hasExpandedClasses(["m-2"], ["p", "m"])).toBe(true);
  });

  it("should return true when any prefix matches", () => {
    expect(hasExpandedClasses(["p-4", "other"], ["p", "m"])).toBe(true);
    expect(hasExpandedClasses(["other", "m-2"], ["p", "m"])).toBe(true);
  });

  it("should handle empty classTokens array", () => {
    expect(hasExpandedClasses([], ["p"])).toBe(false);
  });

  it("should handle prefix matching exactly", () => {
    expect(hasExpandedClasses(["p"], ["p"])).toBe(true);
    expect(hasExpandedClasses(["p-4"], ["p"])).toBe(true);
  });

  it("should handle multiple prefixes", () => {
    expect(hasExpandedClasses(["pt-4", "pb-2"], ["pt", "pb", "pl", "pr"])).toBe(true);
  });

  it("should handle prefix with trailing dash", () => {
    expect(hasExpandedClasses(["p-4"], ["p-"])).toBe(true);
    expect(hasExpandedClasses(["p-4"], ["p"])).toBe(true);
  });

  it("should return false when classTokens is null and prefixes is empty", () => {
    expect(hasExpandedClasses(null, [])).toBe(false);
  });

  it("should handle classes that start with prefix but have more characters", () => {
    expect(hasExpandedClasses(["padding-4"], ["p"])).toBe(true);
    expect(hasExpandedClasses(["margin-4"], ["m"])).toBe(true);
  });
});

