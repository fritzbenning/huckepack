import { describe, expect, it } from "vitest";
import { convertNumericValueToUnit } from "./convertNumericValueToUnit";

describe("convertNumericValueToUnit", () => {
  it("should return same value when units are the same", () => {
    expect(convertNumericValueToUnit(10, "px", "px")).toBe(10);
    expect(convertNumericValueToUnit(5, "rem", "rem")).toBe(5);
  });

  it("should convert px to rem", () => {
    expect(convertNumericValueToUnit(16, "px", "rem")).toBe(1);
    expect(convertNumericValueToUnit(32, "px", "rem")).toBe(2);
  });

  it("should convert rem to px", () => {
    expect(convertNumericValueToUnit(1, "rem", "px")).toBe(16);
    expect(convertNumericValueToUnit(2, "rem", "px")).toBe(32);
  });

  it("should convert scale to px", () => {
    expect(convertNumericValueToUnit(4, "scale", "px")).toBe(16);
    expect(convertNumericValueToUnit(8, "scale", "px")).toBe(32);
  });

  it("should convert px to scale", () => {
    expect(convertNumericValueToUnit(16, "px", "scale")).toBe(4);
    expect(convertNumericValueToUnit(20, "px", "scale")).toBe(5);
  });

  it("should round scale values to quarter steps", () => {
    expect(convertNumericValueToUnit(17, "px", "scale")).toBe(4.25);
    expect(convertNumericValueToUnit(18, "px", "scale")).toBe(4.5);
  });

  it("should handle percent conversions", () => {
    expect(convertNumericValueToUnit(50, "%", "px")).toBe(50);
    expect(convertNumericValueToUnit(50, "px", "%")).toBe(50);
  });

  it("should handle vw and vh conversions", () => {
    expect(convertNumericValueToUnit(100, "vw", "px")).toBe(100);
    expect(convertNumericValueToUnit(100, "vh", "px")).toBe(100);
  });

  it("should round rem values to 2 decimal places", () => {
    const result = convertNumericValueToUnit(17, "px", "rem");
    expect(result).toBeCloseTo(1.06, 2);
  });

  it("should handle zero values", () => {
    expect(convertNumericValueToUnit(0, "px", "rem")).toBe(0);
    expect(convertNumericValueToUnit(0, "scale", "px")).toBe(0);
  });
});

