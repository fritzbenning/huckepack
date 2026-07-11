import { describe, expect, it } from "vitest";
import { extractNumericValue } from "./extractNumericValue";

describe("extractNumericValue", () => {
  it("should return null values for empty className", () => {
    expect(extractNumericValue("", "tracking")).toEqual({ value: null, unit: null });
  });

  it("should return null values when className does not start with prefix", () => {
    expect(extractNumericValue("padding-2", "tracking")).toEqual({ value: null, unit: null });
    expect(extractNumericValue("w-4", "tracking")).toEqual({ value: null, unit: null });
  });

  describe("arbitrary values", () => {
    it("should extract em values", () => {
      expect(extractNumericValue("tracking-[2em]", "tracking")).toEqual({ value: 2, unit: "em" });
      expect(extractNumericValue("tracking-[1.5em]", "tracking")).toEqual({ value: 1.5, unit: "em" });
      expect(extractNumericValue("tracking-[0.5em]", "tracking")).toEqual({ value: 0.5, unit: "em" });
    });

    it("should extract px values", () => {
      expect(extractNumericValue("tracking-[16px]", "tracking")).toEqual({ value: 16, unit: "px" });
      expect(extractNumericValue("tracking-[1.5px]", "tracking")).toEqual({ value: 1.5, unit: "px" });
    });

    it("should extract rem values", () => {
      expect(extractNumericValue("tracking-[1rem]", "tracking")).toEqual({ value: 1, unit: "rem" });
      expect(extractNumericValue("tracking-[1.25rem]", "tracking")).toEqual({ value: 1.25, unit: "rem" });
    });

    it("should extract percent values", () => {
      expect(extractNumericValue("tracking-[50%]", "tracking")).toEqual({ value: 50, unit: "%" });
      expect(extractNumericValue("tracking-[100%]", "tracking")).toEqual({ value: 100, unit: "%" });
    });

    it("should extract vw values", () => {
      expect(extractNumericValue("tracking-[100vw]", "tracking")).toEqual({ value: 100, unit: "vw" });
      expect(extractNumericValue("tracking-[50vw]", "tracking")).toEqual({ value: 50, unit: "vw" });
    });

    it("should extract vh values", () => {
      expect(extractNumericValue("tracking-[100vh]", "tracking")).toEqual({ value: 100, unit: "vh" });
      expect(extractNumericValue("tracking-[50vh]", "tracking")).toEqual({ value: 50, unit: "vh" });
    });

    it("should handle negative values", () => {
      expect(extractNumericValue("tracking-[-2em]", "tracking")).toEqual({ value: -2, unit: "em" });
      expect(extractNumericValue("tracking-[-1.5px]", "tracking")).toEqual({ value: -1.5, unit: "px" });
    });

    it("should return null for arbitrary values without valid unit", () => {
      expect(extractNumericValue("tracking-[abc]", "tracking")).toEqual({ value: null, unit: null });
      expect(extractNumericValue("tracking-[2]", "tracking")).toEqual({ value: null, unit: null });
      expect(extractNumericValue("tracking-[2pt]", "tracking")).toEqual({ value: null, unit: null });
      expect(extractNumericValue("tracking-[2cm]", "tracking")).toEqual({ value: null, unit: null });
    });

    it("should handle different prefixes with arbitrary values", () => {
      expect(extractNumericValue("padding-[16px]", "padding")).toEqual({ value: 16, unit: "px" });
      expect(extractNumericValue("w-[100px]", "w")).toEqual({ value: 100, unit: "px" });
      expect(extractNumericValue("h-[50%]", "h")).toEqual({ value: 50, unit: "%" });
    });
  });

  describe("scale values", () => {
    it("should extract positive integer scale values", () => {
      expect(extractNumericValue("tracking-2", "tracking")).toEqual({ value: 2, unit: "scale" });
      expect(extractNumericValue("tracking-10", "tracking")).toEqual({ value: 10, unit: "scale" });
      expect(extractNumericValue("tracking-0", "tracking")).toEqual({ value: 0, unit: "scale" });
    });

    it("should return null for double-dash negative scale values", () => {
      expect(extractNumericValue("tracking--2", "tracking")).toEqual({ value: null, unit: null });
      expect(extractNumericValue("tracking--10", "tracking")).toEqual({ value: null, unit: null });
    });

    it("should extract decimal scale values", () => {
      expect(extractNumericValue("tracking-1.5", "tracking")).toEqual({ value: 1.5, unit: "scale" });
      expect(extractNumericValue("tracking-0.5", "tracking")).toEqual({ value: 0.5, unit: "scale" });
      expect(extractNumericValue("tracking-10.25", "tracking")).toEqual({ value: 10.25, unit: "scale" });
    });

    it("should return null for scale values with fractions", () => {
      expect(extractNumericValue("tracking-2/3", "tracking")).toEqual({ value: null, unit: null });
      expect(extractNumericValue("tracking-1/2", "tracking")).toEqual({ value: null, unit: null });
    });

    it("should handle different prefixes with scale values", () => {
      expect(extractNumericValue("padding-4", "padding")).toEqual({ value: 4, unit: "scale" });
      expect(extractNumericValue("w-8", "w")).toEqual({ value: 8, unit: "scale" });
      expect(extractNumericValue("h-12", "h")).toEqual({ value: 12, unit: "scale" });
    });
  });

  describe("prefix normalization", () => {
    it("should handle prefix without trailing dash", () => {
      expect(extractNumericValue("tracking-2", "tracking")).toEqual({ value: 2, unit: "scale" });
      expect(extractNumericValue("tracking-[2em]", "tracking")).toEqual({ value: 2, unit: "em" });
    });

    it("should handle prefix with trailing dash", () => {
      expect(extractNumericValue("tracking-2", "tracking-")).toEqual({ value: 2, unit: "scale" });
      expect(extractNumericValue("tracking-[2em]", "tracking-")).toEqual({ value: 2, unit: "em" });
    });
  });
});

