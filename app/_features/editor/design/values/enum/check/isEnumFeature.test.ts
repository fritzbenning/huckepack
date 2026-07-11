import type { DesignPropertyFeatureType } from "@editor/design/property-types";
import { describe, expect, it } from "vitest";
import { isEnumFeature } from "./isEnumFeature";

describe("isEnumFeature", () => {
  it("should return true for enum feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "enum",
      prefix: "flex",
      classes: ["flex-row", "flex-col"],
    };

    expect(isEnumFeature(feature)).toBe(true);
  });

  it("should return false for toggle feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "toggle",
      prefix: "",
      classes: ["hidden", "block"],
    };

    expect(isEnumFeature(feature)).toBe(false);
  });

  it("should return false for numeric feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "numeric",
      prefix: "w",
      classes: ["w-0", "w-1"],
    };

    expect(isEnumFeature(feature)).toBe(false);
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

    expect(isEnumFeature(feature)).toBe(false);
  });

  it("should narrow type correctly", () => {
    const feature: DesignPropertyFeatureType = {
      type: "enum",
      prefix: "flex",
      classes: ["flex-row", "flex-col"],
      defaultValue: "flex-row",
    };

    if (isEnumFeature(feature)) {
      expect(feature.defaultValue).toBe("flex-row");
      expect(feature.type).toBe("enum");
    }
  });
});
