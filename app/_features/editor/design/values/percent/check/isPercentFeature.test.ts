import { describe, expect, it } from "vitest";
import type { DesignPropertyFeatureType } from "../../types";
import { isPercentFeature } from "./isPercentFeature";

describe("isPercentFeature", () => {
  it("should return true for percentValue feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "percentValue",
      classes: ["w-full"],
      prefix: "w",
      exactValues: [0, 25, 50, 75, 100],
      defaultValue: 0,
      range: { min: 0, max: 100 },
    };

    expect(isPercentFeature(feature)).toBe(true);
  });

  it("should return false for enum feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "enum",
      prefix: "flex",
      classes: ["flex-row", "flex-col"],
    };

    expect(isPercentFeature(feature)).toBe(false);
  });

  it("should return false for toggle feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "toggle",
      prefix: "",
      classes: ["hidden", "block"],
    };

    expect(isPercentFeature(feature)).toBe(false);
  });

  it("should return false for numeric feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "numeric",
      prefix: "w",
      classes: ["w-0", "w-1"],
    };

    expect(isPercentFeature(feature)).toBe(false);
  });

  it("should narrow type correctly", () => {
    const feature: DesignPropertyFeatureType = {
      type: "percentValue",
      classes: ["w-full"],
      prefix: "w",
      exactValues: [0, 25, 50, 75, 100],
      defaultValue: 0,
      range: { min: 0, max: 100 },
    };

    if (isPercentFeature(feature)) {
      expect(feature.prefix).toBe("w");
      expect(feature.exactValues).toEqual([0, 25, 50, 75, 100]);
      expect(feature.type).toBe("percentValue");
    }
  });
});
