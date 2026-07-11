import { describe, expect, it } from "vitest";
import type { TokenMap } from "../../types";
import { createTokenClass } from "./createTokenClass";

describe("createTokenClass", () => {
  const createTokenMap = (): TokenMap => ({
    sm: 0.5,
    md: 1,
    lg: 1.5,
    "": 0,
  });

  it("should return property when token is empty string", () => {
    const tokenMap = createTokenMap();
    expect(createTokenClass("", "w", tokenMap)).toBe("w");
  });

  it("should format token class with property prefix", () => {
    const tokenMap = createTokenMap();
    expect(createTokenClass("sm", "w", tokenMap)).toBe("w-sm");
    expect(createTokenClass("md", "w", tokenMap)).toBe("w-md");
  });

  it("should format token even when not in tokenMap", () => {
    const tokenMap = createTokenMap();
    expect(createTokenClass("unknown", "w", tokenMap)).toBe("w-unknown");
  });

  it("should handle different property names", () => {
    const tokenMap = createTokenMap();
    expect(createTokenClass("sm", "rounded", tokenMap)).toBe("rounded-sm");
    expect(createTokenClass("md", "gap", tokenMap)).toBe("gap-md");
  });

  it("should handle property with trailing dash", () => {
    const tokenMap = createTokenMap();
    expect(createTokenClass("sm", "w-", tokenMap)).toBe("w--sm");
  });

  it("should handle empty tokenMap", () => {
    const tokenMap: TokenMap = {};
    expect(createTokenClass("sm", "w", tokenMap)).toBe("w-sm");
  });
});
