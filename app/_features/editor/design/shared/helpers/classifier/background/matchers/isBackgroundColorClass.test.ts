import { describe, expect, it } from "vitest";
import { isBackgroundColorClass } from "./isBackgroundColorClass";

describe("isBackgroundColorClass", () => {
  it("should return true for color classes", () => {
    expect(isBackgroundColorClass("bg-red-500")).toBe(true);
    expect(isBackgroundColorClass("bg-blue-600")).toBe(true);
    expect(isBackgroundColorClass("bg-green-400")).toBe(true);
    expect(isBackgroundColorClass("bg-[#fff]")).toBe(true);
    expect(isBackgroundColorClass("bg-[#000000]")).toBe(true);
    expect(isBackgroundColorClass("bg-[rgb(255,0,0)]")).toBe(true);
    expect(isBackgroundColorClass("bg-transparent")).toBe(true);
    expect(isBackgroundColorClass("bg-current")).toBe(true);
  });

  it("should return false for non-color classes", () => {
    expect(isBackgroundColorClass("bg-none")).toBe(false);
    expect(isBackgroundColorClass("bg-cover")).toBe(false);
    expect(isBackgroundColorClass("bg-contain")).toBe(false);
    expect(isBackgroundColorClass("bg-center")).toBe(false);
    expect(isBackgroundColorClass("bg-repeat")).toBe(false);
    expect(isBackgroundColorClass("bg-fixed")).toBe(false);
    expect(isBackgroundColorClass("bg-origin-border")).toBe(false);
    expect(isBackgroundColorClass("bg-clip-text")).toBe(false);
  });

  it("should return false for gradient stop classes", () => {
    expect(isBackgroundColorClass("from-red-500")).toBe(false);
    expect(isBackgroundColorClass("via-blue-500")).toBe(false);
    expect(isBackgroundColorClass("to-green-500")).toBe(false);
  });

  it("should return false for non-background classes", () => {
    expect(isBackgroundColorClass("text-red-500")).toBe(false);
    expect(isBackgroundColorClass("p-4")).toBe(false);
    expect(isBackgroundColorClass("m-2")).toBe(false);
    expect(isBackgroundColorClass("flex")).toBe(false);
    expect(isBackgroundColorClass("")).toBe(false);
  });
});
