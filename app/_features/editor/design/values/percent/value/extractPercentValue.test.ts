import { describe, expect, it } from "vitest";
import type { PercentFeature } from "../types";
import { extractPercentValue } from "./extractPercentValue";

describe("extractPercentValue", () => {
  const createFeature = (): PercentFeature => ({
    prefix: "w",
    exactValues: [0, 50, 100],
    defaultValue: 0,
    range: { min: 0, max: 100 },
    displayAs: "decimal", // No conversion for these tests
  });

  it("should parse simple standard class", () => {
    const feature = createFeature();
    expect(extractPercentValue("w0", feature)).toBe(0);
    expect(extractPercentValue("w50", feature)).toBe(50);
    expect(extractPercentValue("w100", feature)).toBe(100);
  });

  it("should parse arbitrary value class", () => {
    const feature = createFeature();
    expect(extractPercentValue("w[0.25]", feature)).toBe(0.25);
    expect(extractPercentValue("w[0.75]", feature)).toBe(0.75);
  });

  it("should return null for empty className", () => {
    const feature = createFeature();
    expect(extractPercentValue("", feature)).toBeNull();
  });

  it("should return null when className does not start with prefix", () => {
    const feature = createFeature();
    expect(extractPercentValue("h50", feature)).toBeNull();
  });

  it("should return null for invalid values", () => {
    const feature = createFeature();
    expect(extractPercentValue("winvalid", feature)).toBeNull();
    expect(extractPercentValue("w[invalid]", feature)).toBeNull();
  });

  it("should clamp values to range", () => {
    const feature = createFeature();
    expect(extractPercentValue("w150", feature)).toBeNull();
    expect(extractPercentValue("w[-10]", feature)).toBeNull();
  });

  it("should handle feature with displayAs percent", () => {
    const feature: PercentFeature = {
      prefix: "opacity",
      exactValues: [0, 50, 100],
      defaultValue: 0,
      range: { min: 0, max: 100 },
      displayAs: "percent",
    };

    expect(extractPercentValue("opacity50", feature)).toBe(0.5);
    expect(extractPercentValue("opacity[0.5]", feature)).toBe(0.5);
  });

  it("should handle prefix with special characters", () => {
    const feature: PercentFeature = {
      prefix: "rounded-",
      exactValues: [0, 50, 100],
      defaultValue: 0,
      range: { min: 0, max: 100 },
      displayAs: "decimal", // No conversion
    };

    expect(extractPercentValue("rounded-50", feature)).toBe(50);
    expect(extractPercentValue("rounded-[0.5]", feature)).toBe(0.5);
  });

  it("should handle NaN values", () => {
    const feature = createFeature();
    expect(extractPercentValue("w[NaN]", feature)).toBeNull();
  });
});
