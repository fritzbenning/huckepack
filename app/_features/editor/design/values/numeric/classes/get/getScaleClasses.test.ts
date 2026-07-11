import { describe, expect, it } from "vitest";
import { getScaleClasses } from "./getScaleClasses";

describe("getScaleClasses", () => {
  it("should generate scale classes with classKey", () => {
    const result = getScaleClasses("w", [0, 1, 2]);
    expect(result).toEqual(["w-0", "w-1", "w-2"]);
  });

  it("should handle single scale", () => {
    const result = getScaleClasses("gap", [4]);
    expect(result).toEqual(["gap-4"]);
  });

  it("should handle empty scales array", () => {
    const result = getScaleClasses("w", []);
    expect(result).toEqual([]);
  });

  it("should handle decimal scales", () => {
    const result = getScaleClasses("gap", [0.5, 1.5, 2.5]);
    expect(result).toEqual(["gap-0.5", "gap-1.5", "gap-2.5"]);
  });

  it("should handle large scales", () => {
    const result = getScaleClasses("w", [96, 128]);
    expect(result).toEqual(["w-96", "w-128"]);
  });

  it("should handle negative scales", () => {
    const result = getScaleClasses("gap", [-1, -2]);
    expect(result).toEqual(["gap--1", "gap--2"]);
  });

  it("should preserve order of scales", () => {
    const result = getScaleClasses("w", [4, 2, 8, 1]);
    expect(result).toEqual(["w-4", "w-2", "w-8", "w-1"]);
  });

  it("should handle classKey with dash", () => {
    const result = getScaleClasses("gap-", [1, 2]);
    expect(result).toEqual(["gap--1", "gap--2"]);
  });

  it("should handle zero scale", () => {
    const result = getScaleClasses("w", [0]);
    expect(result).toEqual(["w-0"]);
  });

  it("should handle many scales", () => {
    const scales = Array.from({ length: 100 }, (_, i) => i);
    const result = getScaleClasses("w", scales);
    expect(result).toHaveLength(100);
    expect(result[0]).toBe("w-0");
    expect(result[99]).toBe("w-99");
  });
});

