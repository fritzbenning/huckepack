import { normalizePrefix, normalizePrefixes } from "@editor/design/shared/utils";
import { describe, expect, it } from "vitest";

describe("normalizePrefix", () => {
  it("should add trailing dash when missing", () => {
    expect(normalizePrefix("w")).toBe("w-");
    expect(normalizePrefix("h")).toBe("h-");
  });

  it("should return unchanged when trailing dash exists", () => {
    expect(normalizePrefix("w-")).toBe("w-");
    expect(normalizePrefix("h-")).toBe("h-");
  });

  it("should handle empty string", () => {
    expect(normalizePrefix("")).toBe("-");
  });

  it("should handle prefix with multiple dashes", () => {
    expect(normalizePrefix("w--")).toBe("w--");
    expect(normalizePrefix("w--")).toBe("w--");
  });

  it("should handle long prefixes", () => {
    expect(normalizePrefix("very-long-prefix-name")).toBe("very-long-prefix-name-");
  });

  it("should remove trailing dash when removeDash is true", () => {
    expect(normalizePrefix("w-", true)).toBe("w");
    expect(normalizePrefix("h-", true)).toBe("h");
  });

  it("should return unchanged when removing dash but no dash exists", () => {
    expect(normalizePrefix("w", true)).toBe("w");
    expect(normalizePrefix("h", true)).toBe("h");
  });

  it("should handle empty string with removeDash", () => {
    expect(normalizePrefix("-", true)).toBe("");
  });
});

describe("normalizePrefixes", () => {
  it("should normalize all prefixes in array", () => {
    expect(normalizePrefixes(["w", "h", "p"])).toEqual(["w-", "h-", "p-"]);
  });

  it("should handle prefixes with existing dashes", () => {
    expect(normalizePrefixes(["w-", "h-", "p"])).toEqual(["w-", "h-", "p-"]);
  });

  it("should handle empty array", () => {
    expect(normalizePrefixes([])).toEqual([]);
  });

  it("should handle undefined", () => {
    expect(normalizePrefixes(undefined)).toEqual([]);
  });

  it("should handle mixed prefixes", () => {
    expect(normalizePrefixes(["w", "h-", "p", "m-"])).toEqual(["w-", "h-", "p-", "m-"]);
  });

  it("should preserve order", () => {
    expect(normalizePrefixes(["a", "b", "c"])).toEqual(["a-", "b-", "c-"]);
  });
});
