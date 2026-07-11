import { describe, expect, it } from "vitest";
import type { TokenMap } from "../types";
import { getTokenOptions } from "./getTokenOptions";

describe("getTokenOptions", () => {
  const createTokenMap = (): TokenMap => ({
    sm: 0.5,
    md: 1,
    lg: 1.5,
    xl: 2,
    "": 0,
  });

  it("should return token options excluding empty string", () => {
    const tokenMap = createTokenMap();
    const result = getTokenOptions(tokenMap);

    expect(result).not.toContainEqual({ value: "", label: expect.any(String) });
    expect(result.length).toBe(4);
  });

  it("should format labels correctly", () => {
    const tokenMap = createTokenMap();
    const result = getTokenOptions(tokenMap);

    expect(result).toContainEqual({ value: "sm", label: "sm" });
    expect(result).toContainEqual({ value: "md", label: "md" });
  });

  it("should handle special labels", () => {
    const tokenMap: TokenMap = {
      full: Infinity,
      none: 0,
    };
    const result = getTokenOptions(tokenMap);

    expect(result).toContainEqual({ value: "full", label: "full" });
    expect(result).toContainEqual({ value: "none", label: "none" });
  });

  it("should sort tokens in correct order", () => {
    const tokenMap: TokenMap = {
      lg: 1.5,
      sm: 0.5,
      md: 1,
      xl: 2,
      "2xl": 2.5,
      "": 0,
    };
    const result = getTokenOptions(tokenMap);

    const values = result.map((r) => r.value);
    expect(values).toEqual(["sm", "md", "lg", "xl", "2xl"]);
  });

  it("should handle tokens not in sort order", () => {
    const tokenMap: TokenMap = {
      custom: 1,
      other: 2,
    };
    const result = getTokenOptions(tokenMap);

    expect(result.length).toBe(2);
    expect(result.map((r) => r.value)).toContain("custom");
    expect(result.map((r) => r.value)).toContain("other");
  });

  it("should handle empty tokenMap", () => {
    const tokenMap: TokenMap = {};
    const result = getTokenOptions(tokenMap);

    expect(result).toEqual([]);
  });

  it("should lowercase non-special labels", () => {
    const tokenMap: TokenMap = {
      CUSTOM: 1,
      Other: 2,
    };
    const result = getTokenOptions(tokenMap);

    expect(result).toContainEqual({ value: "CUSTOM", label: "custom" });
    expect(result).toContainEqual({ value: "Other", label: "other" });
  });
});

