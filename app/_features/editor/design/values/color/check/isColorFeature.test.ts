import { describe, expect, it } from "vitest";
import type { DesignPropertyFeatureType } from "../../types";
import { isColorFeature } from "./isColorFeature";

describe("isColorFeature", () => {
  it("should return true for color feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "color",
      prefix: "bg",
      classes: ["bg-red-500", "bg-blue-600"],
    };

    expect(isColorFeature(feature)).toBe(true);
  });

  it("should return false for enum feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "enum",
      prefix: "flex",
      classes: ["flex-row", "flex-col"],
    };

    expect(isColorFeature(feature)).toBe(false);
  });

  it("should return false for toggle feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "toggle",
      prefix: "",
      classes: ["hidden", "block"],
    };

    expect(isColorFeature(feature)).toBe(false);
  });

  it("should return false for numeric feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "numeric",
      prefix: "w",
      classes: ["w-0", "w-1"],
    };

    expect(isColorFeature(feature)).toBe(false);
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

    expect(isColorFeature(feature)).toBe(false);
  });

  it("should return false for string feature", () => {
    const feature: DesignPropertyFeatureType = {
      type: "string",
      prefix: "content",
      classes: ["content-[]"],
    };

    expect(isColorFeature(feature)).toBe(false);
  });

  it("should return false for null", () => {
    expect(isColorFeature(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isColorFeature(undefined)).toBe(false);
  });

  it("should return false for non-object", () => {
    expect(isColorFeature("string")).toBe(false);
    expect(isColorFeature(123)).toBe(false);
    expect(isColorFeature(true)).toBe(false);
  });

  it("should return false for object without type property", () => {
    const feature = {
      prefix: "bg",
      classes: ["bg-red-500"],
    };

    expect(isColorFeature(feature)).toBe(false);
  });

  it("should return false for object with wrong type", () => {
    const feature = {
      type: "not-color",
      prefix: "bg",
      classes: ["bg-red-500"],
    };

    expect(isColorFeature(feature)).toBe(false);
  });

  it("should narrow type correctly", () => {
    const feature: DesignPropertyFeatureType = {
      type: "color",
      prefix: "bg",
      classes: ["bg-red-500", "bg-blue-600"],
      enumMap: ["red", "blue"],
    };

    if (isColorFeature(feature)) {
      expect(feature.enumMap).toEqual(["red", "blue"]);
      expect(feature.type).toBe("color");
      expect(feature.prefix).toBe("bg");
    }
  });
});
