import { describe, expect, it } from "vitest";
import type { TokenMap } from "../types";
import { hasTokenClass } from "./hasTokenClass";

describe("hasTokenClass", () => {
  const createTokenMap = (): TokenMap => ({
    sm: 0.5,
    md: 1,
    lg: 1.5,
    "": 0,
  });

  it("should return true when token class exists", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass(["w-sm", "other"], "w", tokenMap)).toBe(true);
  });

  it("should return false when classTokens is null", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass(null, "w", tokenMap)).toBe(false);
  });

  it("should return true when prefix matches exactly", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass(["w"], "w", tokenMap)).toBe(false);
    expect(hasTokenClass(["rounded"], "rounded", tokenMap)).toBe(false);
  });

  it("should return true when token class exists", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass(["w-sm"], "w", tokenMap)).toBe(true);
    expect(hasTokenClass(["w-md"], "w", tokenMap)).toBe(true);
    expect(hasTokenClass(["w-lg"], "w", tokenMap)).toBe(true);
  });

  it("should return false when token is not in tokenMap", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass(["w-unknown"], "w", tokenMap)).toBe(false);
  });

  it("should return false when no token class matches", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass(["w-unknown", "other"], "w", tokenMap)).toBe(false);
  });

  it("should return false when class contains brackets", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass(["w-[10px]"], "w", tokenMap)).toBe(false);
  });

  it("should handle corner tokens", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass(["rounded-tl-sm"], "rounded", tokenMap)).toBe(true);
    expect(hasTokenClass(["rounded-tr-md"], "rounded", tokenMap)).toBe(true);
  });

  it("should handle prefix with trailing dash", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass(["w-sm"], "w-", tokenMap)).toBe(true);
  });

  it("should handle prefix without trailing dash", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass(["w-sm"], "w", tokenMap)).toBe(true);
  });

  it("should work without tokenMap (fallback regex)", () => {
    expect(hasTokenClass(["w-sm"], "w")).toBe(true);
    expect(hasTokenClass(["rounded-tl-sm"], "rounded")).toBe(true);
  });

  it("should handle empty classTokens array", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass([], "w", tokenMap)).toBe(false);
  });

  it("should handle special characters in prefix", () => {
    const tokenMap = createTokenMap();
    expect(hasTokenClass(["rounded-tl-sm"], "rounded", tokenMap)).toBe(true);
  });
});

