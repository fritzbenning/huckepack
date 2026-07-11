import { describe, expect, it } from "vitest";
import { COLOR_KEYWORDS, COLOR_NAMES } from "../constants";
import { matchesTextColor } from "./matchesTextColor";

describe("matchesTextColor", () => {
  it("should match color keywords", () => {
    for (const keyword of COLOR_KEYWORDS) {
      expect(matchesTextColor(`text-${keyword}`)).toBe(true);
    }
  });

  it("should match color names with shades", () => {
    for (const colorName of COLOR_NAMES.slice(0, 5)) {
      expect(matchesTextColor(`text-${colorName}-500`)).toBe(true);
    }
  });

  it("should match hex colors", () => {
    expect(matchesTextColor("text-[#fff]")).toBe(true);
    expect(matchesTextColor("text-[#ffffff]")).toBe(true);
  });

  it("should match rgb colors", () => {
    expect(matchesTextColor("text-[rgb(255,0,0)]")).toBe(true);
    expect(matchesTextColor("text-[rgba(255,0,0,0.5)]")).toBe(true);
  });

  it("should match hsl colors", () => {
    expect(matchesTextColor("text-[hsl(0,100%,50%)]")).toBe(true);
  });

  it("should match modern color formats", () => {
    expect(matchesTextColor("text-[oklch(0.5,0.2,180)]")).toBe(true);
    expect(matchesTextColor("text-[oklab(0.5,0.2,0.3)]")).toBe(true);
    expect(matchesTextColor("text-[lab(50,20,30)]")).toBe(true);
    expect(matchesTextColor("text-[lch(50,20,180)]")).toBe(true);
  });

  it("should match CSS color() function", () => {
    expect(matchesTextColor("text-[color(srgb 1 0 0)]")).toBe(true);
  });

  it("should match CSS variables", () => {
    expect(matchesTextColor("text-[var(--my-color)]")).toBe(true);
  });

  it("should not match font size classes", () => {
    expect(matchesTextColor("text-lg")).toBe(false);
    expect(matchesTextColor("text-[14px]")).toBe(false);
  });

  it("should not match align classes", () => {
    expect(matchesTextColor("text-left")).toBe(false);
  });

  it("should not match non-text classes", () => {
    expect(matchesTextColor("bg-red-500")).toBe(false);
  });
});

