import { describe, expect, it } from "vitest";
import { COLOR_KEYWORDS, COLOR_NAMES } from "../constants";
import { matchesBackgroundColor } from "./matchesBackgroundColor";

describe("matchesBackgroundColor", () => {
  it("should match color keywords", () => {
    for (const keyword of COLOR_KEYWORDS) {
      expect(matchesBackgroundColor(`bg-${keyword}`, COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
    }
  });

  it("should match color names with shades", () => {
    for (const colorName of COLOR_NAMES.slice(0, 5)) {
      expect(matchesBackgroundColor(`bg-${colorName}-500`, COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
    }
  });

  it("should match hex colors", () => {
    expect(matchesBackgroundColor("bg-[#fff]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
    expect(matchesBackgroundColor("bg-[#ffffff]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
  });

  it("should match rgb colors", () => {
    expect(matchesBackgroundColor("bg-[rgb(255,0,0)]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
    expect(matchesBackgroundColor("bg-[rgba(255,0,0,0.5)]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
  });

  it("should match hsl colors", () => {
    expect(matchesBackgroundColor("bg-[hsl(0,100%,50%)]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
  });

  it("should match modern color formats", () => {
    expect(matchesBackgroundColor("bg-[oklch(0.5,0.2,180)]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
    expect(matchesBackgroundColor("bg-[oklab(0.5,0.2,0.3)]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
    expect(matchesBackgroundColor("bg-[lab(50,20,30)]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
    expect(matchesBackgroundColor("bg-[lch(50,20,180)]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
  });

  it("should match CSS color() function", () => {
    expect(matchesBackgroundColor("bg-[color(srgb 1 0 0)]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
  });

  it("should match CSS variables", () => {
    expect(matchesBackgroundColor("bg-[var(--my-color)]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(true);
  });

  it("should not match non-color classes", () => {
    expect(matchesBackgroundColor("bg-none", COLOR_KEYWORDS, COLOR_NAMES)).toBe(false);
    expect(matchesBackgroundColor("bg-[url('test.jpg')]", COLOR_KEYWORDS, COLOR_NAMES)).toBe(false);
    expect(matchesBackgroundColor("text-red-500", COLOR_KEYWORDS, COLOR_NAMES)).toBe(false);
  });
});

