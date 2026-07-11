import { describe, expect, it } from "vitest";
import type { TokenMap } from "../types";
import { extractTokenValue } from "./extractTokenValue";

describe("extractTokenValue", () => {
  const createTokenMap = (): TokenMap => ({
    sm: 0.5,
    md: 1,
    lg: 1.5,
    "": 0,
  });

  it("should return null for null input", () => {
    const tokenMap = createTokenMap();
    const result = extractTokenValue(null, "w", tokenMap);
    expect(result).toBeNull();
  });

  it("should extract token from class with prefix", () => {
    const tokenMap = createTokenMap();
    expect(extractTokenValue("w-sm", "w", tokenMap)).toBe("sm");
    expect(extractTokenValue("w-md", "w", tokenMap)).toBe("md");
    expect(extractTokenValue("w-lg", "w", tokenMap)).toBe("lg");
  });

  it("should extract token from class with normalized prefix", () => {
    const tokenMap = createTokenMap();
    expect(extractTokenValue("w-sm", "w-", tokenMap)).toBe("sm");
    expect(extractTokenValue("rounded-md", "rounded", tokenMap)).toBe("md");
  });

  it("should return null for class that does not start with prefix", () => {
    const tokenMap = createTokenMap();
    expect(extractTokenValue("h-sm", "w", tokenMap)).toBeNull();
    expect(extractTokenValue("p-md", "w", tokenMap)).toBeNull();
  });

  it("should return null for token not in token map", () => {
    const tokenMap = createTokenMap();
    expect(extractTokenValue("w-10", "w", tokenMap)).toBeNull();
    expect(extractTokenValue("w-xl", "w", tokenMap)).toBeNull();
  });

  it("should handle exact prefix match with default token", () => {
    const tokenMap: TokenMap = {
      "": 0.5,
      sm: 0.5,
      md: 1,
    };
    const result = extractTokenValue("w", "w", tokenMap);
    expect(result).toBe("sm");
  });

  it("should return empty string for exact prefix match when only default token exists", () => {
    const tokenMap: TokenMap = {
      "": 0.5,
    };
    const result = extractTokenValue("w", "w", tokenMap);
    expect(result).toBe("");
  });

  it("should return null for exact prefix match when no default token exists", () => {
    const tokenMap: TokenMap = {
      sm: 0.5,
      md: 1,
    };
    const result = extractTokenValue("w", "w", tokenMap);
    expect(result).toBeNull();
  });

  it("should handle exact prefix match with multiple tokens having same value as default", () => {
    const tokenMap: TokenMap = {
      "": 1,
      sm: 1,
      md: 1,
      lg: 2,
    };
    const result = extractTokenValue("w", "w", tokenMap);
    expect(result).toBe("sm");
  });

  it("should handle empty string token", () => {
    const tokenMap: TokenMap = {
      "": 0.5,
      sm: 1,
    };
    expect(extractTokenValue("w-", "w", tokenMap)).toBe("");
  });

  it("should handle class with only prefix and dash", () => {
    const tokenMap: TokenMap = {
      "": 0.5,
      sm: 1,
    };
    expect(extractTokenValue("w-", "w", tokenMap)).toBe("");
  });

  it("should handle numeric token names", () => {
    const tokenMap: TokenMap = {
      "0": 0,
      "1": 0.25,
      "2": 0.5,
    };
    expect(extractTokenValue("w-0", "w", tokenMap)).toBe("0");
    expect(extractTokenValue("w-1", "w", tokenMap)).toBe("1");
    expect(extractTokenValue("w-2", "w", tokenMap)).toBe("2");
  });

  it("should handle multi-part token names", () => {
    const tokenMap: TokenMap = {
      "2xl": 2.5,
      "3xl": 3,
      sm: 0.5,
    };
    expect(extractTokenValue("w-2xl", "w", tokenMap)).toBe("2xl");
    expect(extractTokenValue("w-3xl", "w", tokenMap)).toBe("3xl");
  });

  it("should handle special token names", () => {
    const tokenMap: TokenMap = {
      full: Infinity,
      none: 0,
      auto: NaN,
    };
    expect(extractTokenValue("w-full", "w", tokenMap)).toBe("full");
    expect(extractTokenValue("w-none", "w", tokenMap)).toBe("none");
    expect(extractTokenValue("w-auto", "w", tokenMap)).toBe("auto");
  });

  it("should handle empty token map", () => {
    const tokenMap: TokenMap = {};
    expect(extractTokenValue("w-sm", "w", tokenMap)).toBeNull();
    expect(extractTokenValue("w", "w", tokenMap)).toBeNull();
  });
});





