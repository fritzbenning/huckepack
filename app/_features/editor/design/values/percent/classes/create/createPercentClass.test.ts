import { describe, expect, it } from "vitest";
import type { PercentFeature } from "../../types";
import { createPercentClass } from "./createPercentClass";

describe("createPercentClass", () => {
  const createFeature = (): PercentFeature => ({
    prefix: "w",
    exactValues: [0, 50, 100],
    defaultValue: 0,
    range: { min: 0, max: 100 },
    displayAs: "decimal", // No conversion for these tests
  });

  it("should format standard value as simple class", () => {
    const feature = createFeature();
    expect(createPercentClass(0, feature)).toBe("w0");
    expect(createPercentClass(50, feature)).toBe("w50");
    expect(createPercentClass(100, feature)).toBe("w100");
  });

  it("should format non-standard value as arbitrary class", () => {
    const feature = createFeature();
    expect(createPercentClass(25, feature)).toBe("w[25]");
    expect(createPercentClass(75, feature)).toBe("w[75]");
  });

  it("should clamp values below minimum", () => {
    const feature = createFeature();
    const result = createPercentClass(-0.1, feature);
    expect(result).toBe("w0");
  });

  it("should clamp values above maximum", () => {
    const feature = createFeature();
    const result = createPercentClass(1.5, feature);
    expect(result).toBe("w[1.5]");
  });

  it("should round display values", () => {
    const feature = createFeature();
    expect(createPercentClass(50.1, feature)).toBe("w50");
    expect(createPercentClass(49.9, feature)).toBe("w50");
    expect(createPercentClass(25.1, feature)).toBe("w[25.1]");
  });

  it("should handle feature with displayAs percent", () => {
    const feature: PercentFeature = {
      prefix: "opacity",
      exactValues: [0, 50, 100],
      defaultValue: 0,
      range: { min: 0, max: 100 },
      displayAs: "percent",
    };

    expect(createPercentClass(0.5, feature)).toBe("opacity50");
    expect(createPercentClass(0.25, feature)).toBe("opacity[0.25]");
  });

  it("should handle custom range", () => {
    const feature: PercentFeature = {
      prefix: "scale",
      exactValues: [50, 100, 150],
      defaultValue: 100,
      range: { min: 50, max: 150 },
      displayAs: "decimal", // No conversion
    };

    expect(createPercentClass(50, feature)).toBe("scale50");
    expect(createPercentClass(120, feature)).toBe("scale[120]");
  });
});
