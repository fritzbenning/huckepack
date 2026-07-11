import { describe, expect, it } from "vitest";
import { roundToQuarterStep } from "./roundToQuarterStep";

describe("roundToQuarterStep", () => {
  it("should round to nearest quarter", () => {
    expect(roundToQuarterStep(0)).toBe(0);
    expect(roundToQuarterStep(0.25)).toBe(0.25);
    expect(roundToQuarterStep(0.5)).toBe(0.5);
    expect(roundToQuarterStep(0.75)).toBe(0.75);
    expect(roundToQuarterStep(1)).toBe(1);
  });

  it("should round values between quarters", () => {
    expect(roundToQuarterStep(0.1)).toBe(0);
    expect(roundToQuarterStep(0.3)).toBe(0.25);
    expect(roundToQuarterStep(0.4)).toBe(0.5);
    expect(roundToQuarterStep(0.6)).toBe(0.5);
    expect(roundToQuarterStep(0.8)).toBe(0.75);
  });

  it("should handle negative values", () => {
    expect(roundToQuarterStep(-0.1)).toBe(-0);
    expect(roundToQuarterStep(-0.3)).toBe(-0.25);
    expect(roundToQuarterStep(-0.5)).toBe(-0.5);
  });

  it("should handle large values", () => {
    expect(roundToQuarterStep(10.1)).toBe(10);
    expect(roundToQuarterStep(10.3)).toBe(10.25);
    expect(roundToQuarterStep(10.5)).toBe(10.5);
  });

  it("should handle decimal precision", () => {
    expect(roundToQuarterStep(0.125)).toBe(0.25);
    expect(roundToQuarterStep(0.375)).toBe(0.5);
    expect(roundToQuarterStep(0.625)).toBe(0.75);
    expect(roundToQuarterStep(0.875)).toBe(1);
  });

  it("should handle exact quarter values", () => {
    expect(roundToQuarterStep(1.25)).toBe(1.25);
    expect(roundToQuarterStep(2.5)).toBe(2.5);
    expect(roundToQuarterStep(3.75)).toBe(3.75);
  });
});

