import { describe, expect, it } from "vitest";
import { isBackgroundImageClass } from "./isBackgroundImageClass";

describe("isBackgroundImageClass", () => {
  it("should return true for image classes", () => {
    expect(isBackgroundImageClass("bg-none")).toBe(true);
    expect(isBackgroundImageClass("bg-[url('test.jpg')]")).toBe(true);
    expect(isBackgroundImageClass("bg-[url('https://example.com/image.png')]")).toBe(true);
    expect(isBackgroundImageClass("bg-linear-to-r")).toBe(true);
    expect(isBackgroundImageClass("bg-gradient-to-r")).toBe(true);
    expect(isBackgroundImageClass("bg-gradient-to-b")).toBe(true);
  });

  it("should return true for gradient stop classes", () => {
    expect(isBackgroundImageClass("from-red-500")).toBe(true);
    expect(isBackgroundImageClass("from-blue-600")).toBe(true);
    expect(isBackgroundImageClass("via-blue-500")).toBe(true);
    expect(isBackgroundImageClass("via-green-400")).toBe(true);
    expect(isBackgroundImageClass("to-green-500")).toBe(true);
    expect(isBackgroundImageClass("to-purple-700")).toBe(true);
  });

  it("should return false for non-image classes", () => {
    expect(isBackgroundImageClass("bg-red-500")).toBe(false);
    expect(isBackgroundImageClass("bg-blue-600")).toBe(false);
    expect(isBackgroundImageClass("bg-cover")).toBe(false);
    expect(isBackgroundImageClass("bg-contain")).toBe(false);
    expect(isBackgroundImageClass("bg-center")).toBe(false);
    expect(isBackgroundImageClass("bg-repeat")).toBe(false);
    expect(isBackgroundImageClass("bg-fixed")).toBe(false);
    expect(isBackgroundImageClass("bg-origin-border")).toBe(false);
    expect(isBackgroundImageClass("bg-clip-text")).toBe(false);
  });

  it("should return false for non-background classes", () => {
    expect(isBackgroundImageClass("text-red-500")).toBe(false);
    expect(isBackgroundImageClass("p-4")).toBe(false);
    expect(isBackgroundImageClass("m-2")).toBe(false);
    expect(isBackgroundImageClass("flex")).toBe(false);
    expect(isBackgroundImageClass("")).toBe(false);
  });
});

