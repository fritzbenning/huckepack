import { describe, expect, it } from "vitest";
import { isTextColorClass } from "./isTextColorClass";

describe("isTextColorClass", () => {
  it("should return true for color classes", () => {
    expect(isTextColorClass("text-red-500")).toBe(true);
    expect(isTextColorClass("text-blue-600")).toBe(true);
    expect(isTextColorClass("text-green-400")).toBe(true);
    expect(isTextColorClass("text-slate-300")).toBe(true);
    expect(isTextColorClass("text-gray-700")).toBe(true);
    expect(isTextColorClass("text-indigo-800")).toBe(true);
    expect(isTextColorClass("text-[#fff]")).toBe(true);
    expect(isTextColorClass("text-[#000000]")).toBe(true);
    expect(isTextColorClass("text-[rgb(255,0,0)]")).toBe(true);
    expect(isTextColorClass("text-[hsl(0,100%,50%)]")).toBe(true);
    expect(isTextColorClass("text-[oklch(0.5,0.2,180)]")).toBe(true);
    expect(isTextColorClass("text-[oklab(0.5,0.1,0.2)]")).toBe(true);
    expect(isTextColorClass("text-[lab(50,20,30)]")).toBe(true);
    expect(isTextColorClass("text-[lch(50,20,180)]")).toBe(true);
    expect(isTextColorClass("text-[color(display-p3,1,0,0)]")).toBe(true);
    expect(isTextColorClass("text-[var(--color-primary)]")).toBe(true);
    expect(isTextColorClass("text-transparent")).toBe(true);
    expect(isTextColorClass("text-current")).toBe(true);
    expect(isTextColorClass("text-inherit")).toBe(true);
    expect(isTextColorClass("text-black")).toBe(true);
    expect(isTextColorClass("text-white")).toBe(true);
  });

  it("should return false for non-color classes", () => {
    expect(isTextColorClass("text-lg")).toBe(false);
    expect(isTextColorClass("text-xl")).toBe(false);
    expect(isTextColorClass("text-[14px]")).toBe(false);
    expect(isTextColorClass("text-left")).toBe(false);
    expect(isTextColorClass("text-center")).toBe(false);
    expect(isTextColorClass("text-right")).toBe(false);
    expect(isTextColorClass("text-justify")).toBe(false);
  });

  it("should return false for non-text classes", () => {
    expect(isTextColorClass("bg-red-500")).toBe(false);
    expect(isTextColorClass("p-4")).toBe(false);
    expect(isTextColorClass("m-2")).toBe(false);
    expect(isTextColorClass("flex")).toBe(false);
    expect(isTextColorClass("")).toBe(false);
  });

  it("should return false for invalid text classes", () => {
    expect(isTextColorClass("text-")).toBe(false);
    expect(isTextColorClass("text-invalid")).toBe(false);
    expect(isTextColorClass("text-unknown-class")).toBe(false);
  });
});

