import { describe, expect, it } from "vitest";
import { fractionToPercent } from "./fractionToPercent";

describe("fractionToPercent", () => {
  it("should convert valid fractions to percentages", () => {
    expect(fractionToPercent("1/2")).toBe(50);
    expect(fractionToPercent("1/3")).toBe(33.333);
    expect(fractionToPercent("2/3")).toBe(66.667);
    expect(fractionToPercent("1/4")).toBe(25);
    expect(fractionToPercent("3/4")).toBe(75);
    expect(fractionToPercent("1/5")).toBe(20);
    expect(fractionToPercent("2/5")).toBe(40);
    expect(fractionToPercent("3/5")).toBe(60);
    expect(fractionToPercent("4/5")).toBe(80);
    expect(fractionToPercent("1/6")).toBe(16.667);
    expect(fractionToPercent("5/6")).toBe(83.333);
    expect(fractionToPercent("1/8")).toBe(12.5);
    expect(fractionToPercent("3/8")).toBe(37.5);
    expect(fractionToPercent("5/8")).toBe(62.5);
    expect(fractionToPercent("7/8")).toBe(87.5);
    expect(fractionToPercent("1/9")).toBe(11.111);
    expect(fractionToPercent("2/9")).toBe(22.222);
    expect(fractionToPercent("4/9")).toBe(44.444);
    expect(fractionToPercent("5/9")).toBe(55.556);
    expect(fractionToPercent("7/9")).toBe(77.778);
    expect(fractionToPercent("8/9")).toBe(88.889);
    expect(fractionToPercent("1/10")).toBe(10);
    expect(fractionToPercent("3/10")).toBe(30);
    expect(fractionToPercent("7/10")).toBe(70);
    expect(fractionToPercent("9/10")).toBe(90);
  });

  it("should return null for invalid fractions", () => {
    expect(fractionToPercent("invalid")).toBeNull();
    expect(fractionToPercent("1/1")).toBeNull();
    expect(fractionToPercent("2/1")).toBeNull();
    expect(fractionToPercent("1/7")).toBeNull();
    expect(fractionToPercent("1/11")).toBeNull();
    expect(fractionToPercent("3/7")).toBeNull();
    expect(fractionToPercent("")).toBeNull();
    expect(fractionToPercent("1")).toBeNull();
    expect(fractionToPercent("/2")).toBeNull();
    expect(fractionToPercent("1/")).toBeNull();
  });

  it("should return null for non-fraction strings", () => {
    expect(fractionToPercent("50%")).toBeNull();
    expect(fractionToPercent("half")).toBeNull();
    expect(fractionToPercent("1 2")).toBeNull();
    expect(fractionToPercent("1-2")).toBeNull();
    expect(fractionToPercent("1_2")).toBeNull();
  });

  it("should return null for edge cases", () => {
    expect(fractionToPercent("0/2")).toBeNull();
    expect(fractionToPercent("2/0")).toBeNull();
    expect(fractionToPercent("1.5/2")).toBeNull();
    expect(fractionToPercent("1/2.5")).toBeNull();
    expect(fractionToPercent(" 1/2 ")).toBeNull();
    expect(fractionToPercent("1 / 2")).toBeNull();
  });

  it("should handle case sensitivity", () => {
    expect(fractionToPercent("1/2")).toBe(50);
    expect(fractionToPercent("W-1/2")).toBeNull();
    expect(fractionToPercent("1/2W")).toBeNull();
  });
});

