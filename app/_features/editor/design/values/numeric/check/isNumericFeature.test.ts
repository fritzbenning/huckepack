import { describe, expect, it } from "vitest";
import type { DesignPropertyFeatureType } from "../../types";
import { isNumericFeature } from "./isNumericFeature";

describe("isNumericFeature", () => {
  it("should return true for numeric feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "numeric",
      classes: ["w-0", "w-1"],
    };

    expect(isNumericFeature(feature)).toBe(true);
  });

  it("should return false for enum feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "enum",
      classes: ["flex-row", "flex-col"],
    };

    expect(isNumericFeature(feature)).toBe(false);
  });

  it("should return false for toggle feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "toggle",
      classes: ["hidden", "block"],
    };

    expect(isNumericFeature(feature)).toBe(false);
  });

  it("should return false for percentValue feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "percentValue",
      classes: ["w-full"],
      prefix: "w",
      exactValues: [0, 25, 50, 75, 100],
      defaultValue: 0,
      range: { min: 0, max: 100 },
    };

    expect(isNumericFeature(feature)).toBe(false);
  });

  it("should narrow type correctly", () => {
    const feature: DesignPropertyFeatureType = {
      type: "numeric",
      classes: ["w-0", "w-1"],
      prefixes: ["w"],
      defaultUnit: "px",
    };

    if (isNumericFeature(feature)) {
      expect(feature.prefixes).toEqual(["w"]);
      expect(feature.defaultUnit).toBe("px");
      expect(feature.type).toBe("numeric");
    }
  });
});
