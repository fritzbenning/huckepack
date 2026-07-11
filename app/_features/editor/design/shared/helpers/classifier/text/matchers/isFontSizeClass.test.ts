import { describe, expect, it } from "vitest";
import { isFontSizeClass } from "./isFontSizeClass";

describe("isFontSizeClass", () => {
  it("should return true for font size classes", () => {
    expect(isFontSizeClass("text-xs")).toBe(true);
    expect(isFontSizeClass("text-sm")).toBe(true);
    expect(isFontSizeClass("text-base")).toBe(true);
    expect(isFontSizeClass("text-lg")).toBe(true);
    expect(isFontSizeClass("text-xl")).toBe(true);
    expect(isFontSizeClass("text-2xl")).toBe(true);
    expect(isFontSizeClass("text-3xl")).toBe(true);
    expect(isFontSizeClass("text-4xl")).toBe(true);
    expect(isFontSizeClass("text-5xl")).toBe(true);
    expect(isFontSizeClass("text-6xl")).toBe(true);
    expect(isFontSizeClass("text-7xl")).toBe(true);
    expect(isFontSizeClass("text-8xl")).toBe(true);
    expect(isFontSizeClass("text-9xl")).toBe(true);
    expect(isFontSizeClass("text-[14px]")).toBe(true);
    expect(isFontSizeClass("text-[1.5rem]")).toBe(true);
    expect(isFontSizeClass("text-[2em]")).toBe(true);
  });

  it("should return false for non-font-size classes", () => {
    expect(isFontSizeClass("text-red-500")).toBe(false);
    expect(isFontSizeClass("text-blue-600")).toBe(false);
    expect(isFontSizeClass("text-[#fff]")).toBe(false);
    expect(isFontSizeClass("text-left")).toBe(false);
    expect(isFontSizeClass("text-center")).toBe(false);
    expect(isFontSizeClass("text-right")).toBe(false);
    expect(isFontSizeClass("text-justify")).toBe(false);
    expect(isFontSizeClass("text-transparent")).toBe(false);
    expect(isFontSizeClass("text-current")).toBe(false);
  });

  it("should return false for non-text classes", () => {
    expect(isFontSizeClass("bg-red-500")).toBe(false);
    expect(isFontSizeClass("p-4")).toBe(false);
    expect(isFontSizeClass("m-2")).toBe(false);
    expect(isFontSizeClass("flex")).toBe(false);
    expect(isFontSizeClass("")).toBe(false);
  });

  it("should return false for invalid text classes", () => {
    expect(isFontSizeClass("text-")).toBe(false);
    expect(isFontSizeClass("text-invalid")).toBe(false);
    expect(isFontSizeClass("text-unknown-class")).toBe(false);
  });
});

