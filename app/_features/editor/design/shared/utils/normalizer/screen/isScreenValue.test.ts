import { describe, expect, it } from "vitest";
import { isScreenValue } from "./isScreenValue";

describe("isScreenValue", () => {
  it("should return true for width screen value", () => {
    expect(isScreenValue(100, "vw", "width")).toBe(true);
  });

  it("should return true for height screen value", () => {
    expect(isScreenValue(100, "vh", "height")).toBe(true);
  });

  it("should return false for incorrect width value", () => {
    expect(isScreenValue(99, "vw", "width")).toBe(false);
    expect(isScreenValue(101, "vw", "width")).toBe(false);
    expect(isScreenValue(100, "vh", "width")).toBe(false);
    expect(isScreenValue(100, "px", "width")).toBe(false);
    expect(isScreenValue(100, "rem", "width")).toBe(false);
  });

  it("should return false for incorrect height value", () => {
    expect(isScreenValue(99, "vh", "height")).toBe(false);
    expect(isScreenValue(101, "vh", "height")).toBe(false);
    expect(isScreenValue(100, "vw", "height")).toBe(false);
    expect(isScreenValue(100, "px", "height")).toBe(false);
    expect(isScreenValue(100, "rem", "height")).toBe(false);
  });

  it("should return false for zero values", () => {
    expect(isScreenValue(0, "vw", "width")).toBe(false);
    expect(isScreenValue(0, "vh", "height")).toBe(false);
  });

  it("should return false for negative values", () => {
    expect(isScreenValue(-100, "vw", "width")).toBe(false);
    expect(isScreenValue(-100, "vh", "height")).toBe(false);
  });

  it("should return false for values greater than 100", () => {
    expect(isScreenValue(101, "vw", "width")).toBe(false);
    expect(isScreenValue(200, "vw", "width")).toBe(false);
    expect(isScreenValue(101, "vh", "height")).toBe(false);
    expect(isScreenValue(200, "vh", "height")).toBe(false);
  });

  it("should return false for empty unit", () => {
    expect(isScreenValue(100, "", "width")).toBe(false);
    expect(isScreenValue(100, "", "height")).toBe(false);
  });

  it("should handle decimal values", () => {
    expect(isScreenValue(100.0, "vw", "width")).toBe(true);
    expect(isScreenValue(100.0, "vh", "height")).toBe(true);
    expect(isScreenValue(99.9, "vw", "width")).toBe(false);
    expect(isScreenValue(100.1, "vw", "width")).toBe(false);
  });
});

