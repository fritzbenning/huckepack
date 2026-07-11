import { describe, expect, it } from "vitest";
import { percentToFraction } from "./percentToFraction";

describe("percentToFraction", () => {
  it("should convert exact percentages to fractions", () => {
    expect(percentToFraction(50)).toBe("1/2");
    expect(percentToFraction(33.333)).toBe("1/3");
    expect(percentToFraction(66.667)).toBe("2/3");
    expect(percentToFraction(25)).toBe("1/4");
    expect(percentToFraction(75)).toBe("3/4");
    expect(percentToFraction(20)).toBe("1/5");
    expect(percentToFraction(40)).toBe("2/5");
    expect(percentToFraction(60)).toBe("3/5");
    expect(percentToFraction(80)).toBe("4/5");
    expect(percentToFraction(16.667)).toBe("1/6");
    expect(percentToFraction(83.333)).toBe("5/6");
    expect(percentToFraction(12.5)).toBe("1/8");
    expect(percentToFraction(37.5)).toBe("3/8");
    expect(percentToFraction(62.5)).toBe("5/8");
    expect(percentToFraction(87.5)).toBe("7/8");
    expect(percentToFraction(11.111)).toBe("1/9");
    expect(percentToFraction(22.222)).toBe("2/9");
    expect(percentToFraction(44.444)).toBe("4/9");
    expect(percentToFraction(55.556)).toBe("5/9");
    expect(percentToFraction(77.778)).toBe("7/9");
    expect(percentToFraction(88.889)).toBe("8/9");
    expect(percentToFraction(10)).toBe("1/10");
    expect(percentToFraction(30)).toBe("3/10");
    expect(percentToFraction(70)).toBe("7/10");
    expect(percentToFraction(90)).toBe("9/10");
  });

  it("should round percentages to nearest fraction", () => {
    expect(percentToFraction(33)).toBe("1/3");
    expect(percentToFraction(67)).toBe("2/3");
    expect(percentToFraction(17)).toBe("1/6");
    expect(percentToFraction(83)).toBe("5/6");
  });

  it("should return null for percentages without matching fractions", () => {
    expect(percentToFraction(0)).toBeNull();
    expect(percentToFraction(100)).toBeNull();
    expect(percentToFraction(15)).toBeNull();
    expect(percentToFraction(35)).toBeNull();
    expect(percentToFraction(45)).toBeNull();
    expect(percentToFraction(55)).toBeNull();
    expect(percentToFraction(65)).toBeNull();
    expect(percentToFraction(85)).toBeNull();
    expect(percentToFraction(95)).toBeNull();
    expect(percentToFraction(1)).toBeNull();
    expect(percentToFraction(99)).toBeNull();
    expect(percentToFraction(51)).toBeNull();
    expect(percentToFraction(49)).toBeNull();
  });

  it("should handle edge cases", () => {
    expect(percentToFraction(-1)).toBeNull();
    expect(percentToFraction(101)).toBeNull();
    expect(percentToFraction(50.1)).toBe("1/2");
    expect(percentToFraction(49.9)).toBe("1/2");
    expect(percentToFraction(33.4)).toBe("1/3");
    expect(percentToFraction(33.2)).toBe("1/3");
  });

  it("should handle decimal precision", () => {
    expect(percentToFraction(33.333333)).toBe("1/3");
    expect(percentToFraction(66.666666)).toBe("2/3");
    expect(percentToFraction(16.666666)).toBe("1/6");
    expect(percentToFraction(83.333333)).toBe("5/6");
  });

  it("should handle rounding edge cases", () => {
    expect(percentToFraction(33.5)).toBeNull();
    expect(percentToFraction(66.5)).toBe("2/3");
    expect(percentToFraction(16.5)).toBe("1/6");
    expect(percentToFraction(83.5)).toBeNull();
  });

  it("should handle very small percentages", () => {
    expect(percentToFraction(0.1)).toBeNull();
    expect(percentToFraction(0.5)).toBeNull();
    expect(percentToFraction(1.5)).toBeNull();
  });

  it("should handle very large percentages", () => {
    expect(percentToFraction(99.5)).toBeNull();
    expect(percentToFraction(99.9)).toBeNull();
  });

  it("should handle NaN and Infinity", () => {
    expect(percentToFraction(NaN)).toBeNull();
    expect(percentToFraction(Infinity)).toBeNull();
    expect(percentToFraction(-Infinity)).toBeNull();
  });
});

