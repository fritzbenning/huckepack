import { describe, expect, it, vi } from "vitest";
import { createClassNormalizer } from "../../../class-normalizer/createClassNormalizer";
import type { Normalizer } from "../types";

describe("createClassNormalizer", () => {
  it("should create a normalizer with property and normalizers", () => {
    const normalizers: Normalizer[] = [
      {
        name: "test",
        matches: () => true,
        format: (value, unit) => `test-${value}${unit}`,
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.property).toBe("width");
    expect(normalizer.normalizers).toBe(normalizers);
  });

  it("should normalize value when normalizer matches and preserves unit", () => {
    const normalizers: Normalizer[] = [
      {
        name: "exact",
        matches: (value, unit) => value === 10 && unit === "px",
        format: () => "w-10",
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.normalize(10, "px")).toBe("w-10");
  });

  it("should return arbitrary value when no normalizer matches", () => {
    const normalizers: Normalizer[] = [
      {
        name: "exact",
        matches: () => false,
        format: () => "w-10",
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.normalize(10, "px")).toBe("width-[10px]");
  });

  it("should return arbitrary value when normalizer matches but doesn't preserve unit", () => {
    const normalizers: Normalizer[] = [
      {
        name: "exact",
        matches: () => true,
        format: () => "w-10",
        preservesUnit: () => false,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.normalize(10, "px")).toBe("width-[10px]");
  });

  it("should use first matching normalizer", () => {
    const normalizers: Normalizer[] = [
      {
        name: "first",
        matches: () => true,
        format: () => "first-match",
        preservesUnit: () => true,
      },
      {
        name: "second",
        matches: () => true,
        format: () => "second-match",
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.normalize(10, "px")).toBe("first-match");
  });

  it("should skip normalizers that don't match", () => {
    const normalizers: Normalizer[] = [
      {
        name: "no-match",
        matches: () => false,
        format: () => "no-match",
        preservesUnit: () => true,
      },
      {
        name: "match",
        matches: () => true,
        format: () => "match",
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.normalize(10, "px")).toBe("match");
  });

  it("should skip normalizers that match but don't preserve unit", () => {
    const normalizers: Normalizer[] = [
      {
        name: "no-preserve",
        matches: () => true,
        format: () => "no-preserve",
        preservesUnit: () => false,
      },
      {
        name: "preserve",
        matches: () => true,
        format: () => "preserve",
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.normalize(10, "px")).toBe("preserve");
  });

  it("should handle empty normalizers array", () => {
    const normalizer = createClassNormalizer({
      property: "width",
      normalizers: [],
    });

    expect(normalizer.normalize(10, "px")).toBe("width-[10px]");
  });

  it("should handle different units", () => {
    const normalizers: Normalizer[] = [
      {
        name: "px",
        matches: (_, unit) => unit === "px",
        format: (value) => `w-${value}`,
        preservesUnit: () => true,
      },
      {
        name: "rem",
        matches: (_, unit) => unit === "rem",
        format: (value) => `w-${value}rem`,
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.normalize(10, "px")).toBe("w-10");
    expect(normalizer.normalize(10, "rem")).toBe("w-10rem");
    expect(normalizer.normalize(10, "em")).toBe("width-[10em]");
  });

  it("should handle different values", () => {
    const normalizers: Normalizer[] = [
      {
        name: "ten",
        matches: (value) => value === 10,
        format: () => "w-10",
        preservesUnit: () => true,
      },
      {
        name: "twenty",
        matches: (value) => value === 20,
        format: () => "w-20",
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.normalize(10, "px")).toBe("w-10");
    expect(normalizer.normalize(20, "px")).toBe("w-20");
    expect(normalizer.normalize(30, "px")).toBe("width-[30px]");
  });

  it("should handle zero values", () => {
    const normalizers: Normalizer[] = [
      {
        name: "zero",
        matches: (value) => value === 0,
        format: () => "w-0",
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.normalize(0, "px")).toBe("w-0");
  });

  it("should handle negative values", () => {
    const normalizers: Normalizer[] = [
      {
        name: "negative",
        matches: (value) => value < 0,
        format: (value) => `w-${Math.abs(value)}`,
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.normalize(-10, "px")).toBe("w-10");
    expect(normalizer.normalize(10, "px")).toBe("width-[10px]");
  });

  it("should handle decimal values", () => {
    const normalizers: Normalizer[] = [
      {
        name: "decimal",
        matches: (value) => value % 1 !== 0,
        format: (value) => `w-[${value}px]`,
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    expect(normalizer.normalize(10.5, "px")).toBe("w-[10.5px]");
    expect(normalizer.normalize(10, "px")).toBe("width-[10px]");
  });

  it("should handle very large values", () => {
    const normalizer = createClassNormalizer({
      property: "width",
      normalizers: [],
    });

    expect(normalizer.normalize(999999, "px")).toBe("width-[999999px]");
  });

  it("should handle different properties", () => {
    const widthNormalizer = createClassNormalizer({
      property: "width",
      normalizers: [],
    });

    const heightNormalizer = createClassNormalizer({
      property: "height",
      normalizers: [],
    });

    expect(widthNormalizer.normalize(10, "px")).toBe("width-[10px]");
    expect(heightNormalizer.normalize(10, "px")).toBe("height-[10px]");
  });

  it("should call format with correct parameters", () => {
    const formatSpy = vi.fn((value, unit) => `test-${value}${unit}`);
    const normalizers: Normalizer[] = [
      {
        name: "spy",
        matches: () => true,
        format: formatSpy,
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    normalizer.normalize(42, "rem");

    expect(formatSpy).toHaveBeenCalledWith(42, "rem");
  });

  it("should call matches with correct parameters", () => {
    const matchesSpy = vi.fn(() => true);
    const normalizers: Normalizer[] = [
      {
        name: "spy",
        matches: matchesSpy,
        format: () => "test",
        preservesUnit: () => true,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    normalizer.normalize(42, "rem");

    expect(matchesSpy).toHaveBeenCalledWith(42, "rem");
  });

  it("should call preservesUnit with correct parameters", () => {
    const preservesUnitSpy = vi.fn(() => true);
    const normalizers: Normalizer[] = [
      {
        name: "spy",
        matches: () => true,
        format: () => "test",
        preservesUnit: preservesUnitSpy,
      },
    ];

    const normalizer = createClassNormalizer({
      property: "width",
      normalizers,
    });

    normalizer.normalize(42, "rem");

    expect(preservesUnitSpy).toHaveBeenCalledWith(42, "rem");
  });
});
