import { describe, expect, it } from "vitest";
import { isGradientStopClass } from "./isGradientStopClass";

describe("isGradientStopClass", () => {
  it("should match from- classes", () => {
    expect(isGradientStopClass("from-red-500")).toBe(true);
    expect(isGradientStopClass("from-[#fff]")).toBe(true);
  });

  it("should match via- classes", () => {
    expect(isGradientStopClass("via-blue-500")).toBe(true);
  });

  it("should match to- classes", () => {
    expect(isGradientStopClass("to-green-500")).toBe(true);
  });

  it("should not match other classes", () => {
    expect(isGradientStopClass("bg-red-500")).toBe(false);
    expect(isGradientStopClass("text-red-500")).toBe(false);
  });
});

