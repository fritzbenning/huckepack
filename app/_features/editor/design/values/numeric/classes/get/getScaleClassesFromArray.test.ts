import { describe, expect, it } from "vitest";
import { getScaleClassesFromArray } from "./getScaleClassesFromArray";

describe("getScaleClassesFromArray", () => {
  it("should generate scale classes for multiple classKeys", () => {
    const result = getScaleClassesFromArray([0, 1, 2], ["w", "h"]);
    expect(result).toEqual(["w-0", "w-1", "w-2", "h-0", "h-1", "h-2"]);
  });

  it("should handle single classKey", () => {
    const result = getScaleClassesFromArray([0, 1], ["w"]);
    expect(result).toEqual(["w-0", "w-1"]);
  });

  it("should handle empty classKeys array", () => {
    const result = getScaleClassesFromArray([0, 1], []);
    expect(result).toEqual([]);
  });

  it("should handle empty scales array", () => {
    const result = getScaleClassesFromArray([], ["w", "h"]);
    expect(result).toEqual([]);
  });

  it("should preserve order of classKeys", () => {
    const result = getScaleClassesFromArray([1], ["w", "h", "gap"]);
    expect(result).toEqual(["w-1", "h-1", "gap-1"]);
  });

  it("should handle multiple classKeys with multiple scales", () => {
    const result = getScaleClassesFromArray([0, 4, 8], ["w", "h"]);
    expect(result).toEqual(["w-0", "w-4", "w-8", "h-0", "h-4", "h-8"]);
  });

  it("should handle decimal scales", () => {
    const result = getScaleClassesFromArray([0.5, 1.5], ["gap"]);
    expect(result).toEqual(["gap-0.5", "gap-1.5"]);
  });

  it("should handle many classKeys", () => {
    const classKeys = ["w", "h", "gap", "p", "m"];
    const result = getScaleClassesFromArray([1, 2], classKeys);
    expect(result).toEqual(["w-1", "w-2", "h-1", "h-2", "gap-1", "gap-2", "p-1", "p-2", "m-1", "m-2"]);
  });

  it("should handle duplicate classKeys", () => {
    const result = getScaleClassesFromArray([1, 2], ["w", "w"]);
    expect(result).toEqual(["w-1", "w-2", "w-1", "w-2"]);
  });
});

