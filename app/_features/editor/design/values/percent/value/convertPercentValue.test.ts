import { describe, expect, it } from "vitest";
import type { PercentFeature } from "../types";
import { toDisplay, toInternal } from "./convertPercentValue";

describe("convertPercentValue", () => {
  describe("toInternal", () => {
    it("should convert display to internal using percent conversion (default)", () => {
      const feature: PercentFeature = {
        prefix: "opacity",
        exactValues: [0, 50, 100],
        defaultValue: 0,
        range: { min: 0, max: 100 },
        // displayAs defaults to "percent"
      };

      expect(toInternal(50, feature)).toBe(0.5);
      expect(toInternal(100, feature)).toBe(1);
      expect(toInternal(0, feature)).toBe(0);
    });

    it("should use percent conversion when displayAs is percent", () => {
      const feature: PercentFeature = {
        prefix: "opacity",
        exactValues: [0, 50, 100],
        defaultValue: 0,
        range: { min: 0, max: 100 },
        displayAs: "percent",
      };

      expect(toInternal(50, feature)).toBe(0.5);
      expect(toInternal(100, feature)).toBe(1);
    });

    it("should return display value as-is when displayAs is decimal", () => {
      const feature: PercentFeature = {
        prefix: "w",
        exactValues: [0, 50, 100],
        defaultValue: 0,
        range: { min: 0, max: 100 },
        displayAs: "decimal",
      };

      expect(toInternal(50, feature)).toBe(50);
      expect(toInternal(100, feature)).toBe(100);
    });
  });

  describe("toDisplay", () => {
    it("should convert internal to display using percent conversion (default)", () => {
      const feature: PercentFeature = {
        prefix: "opacity",
        exactValues: [0, 50, 100],
        defaultValue: 0,
        range: { min: 0, max: 100 },
        // displayAs defaults to "percent"
      };

      expect(toDisplay(0.5, feature)).toBe(50);
      expect(toDisplay(1, feature)).toBe(100);
      expect(toDisplay(0, feature)).toBe(0);
    });

    it("should use percent conversion when displayAs is percent", () => {
      const feature: PercentFeature = {
        prefix: "opacity",
        exactValues: [0, 50, 100],
        defaultValue: 0,
        range: { min: 0, max: 100 },
        displayAs: "percent",
      };

      expect(toDisplay(0.5, feature)).toBe(50);
      expect(toDisplay(1, feature)).toBe(100);
    });

    it("should return internal value as-is when displayAs is decimal", () => {
      const feature: PercentFeature = {
        prefix: "w",
        exactValues: [0, 50, 100],
        defaultValue: 0,
        range: { min: 0, max: 100 },
        displayAs: "decimal",
      };

      expect(toDisplay(0.5, feature)).toBe(0.5);
      expect(toDisplay(50, feature)).toBe(50);
    });
  });
});
