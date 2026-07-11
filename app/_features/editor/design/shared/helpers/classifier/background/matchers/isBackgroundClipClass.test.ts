import { describe, expect, it } from "vitest";
import { isBackgroundClipClass } from "./isBackgroundClipClass";

describe("isBackgroundClipClass", () => {
  it("should return true for clip classes", () => {
    expect(isBackgroundClipClass("bg-clip-border")).toBe(true);
    expect(isBackgroundClipClass("bg-clip-padding")).toBe(true);
    expect(isBackgroundClipClass("bg-clip-content")).toBe(true);
    expect(isBackgroundClipClass("bg-clip-text")).toBe(true);
  });

  it("should return false for non-clip classes", () => {
    expect(isBackgroundClipClass("bg-red-500")).toBe(false);
    expect(isBackgroundClipClass("bg-blue-600")).toBe(false);
    expect(isBackgroundClipClass("bg-none")).toBe(false);
    expect(isBackgroundClipClass("bg-cover")).toBe(false);
    expect(isBackgroundClipClass("bg-contain")).toBe(false);
    expect(isBackgroundClipClass("bg-center")).toBe(false);
    expect(isBackgroundClipClass("bg-repeat")).toBe(false);
    expect(isBackgroundClipClass("bg-fixed")).toBe(false);
    expect(isBackgroundClipClass("bg-origin-border")).toBe(false);
    expect(isBackgroundClipClass("bg-origin-padding")).toBe(false);
  });

  it("should return false for gradient stop classes", () => {
    expect(isBackgroundClipClass("from-red-500")).toBe(false);
    expect(isBackgroundClipClass("via-blue-500")).toBe(false);
    expect(isBackgroundClipClass("to-green-500")).toBe(false);
  });

  it("should return false for non-background classes", () => {
    expect(isBackgroundClipClass("text-red-500")).toBe(false);
    expect(isBackgroundClipClass("p-4")).toBe(false);
    expect(isBackgroundClipClass("m-2")).toBe(false);
    expect(isBackgroundClipClass("flex")).toBe(false);
    expect(isBackgroundClipClass("")).toBe(false);
  });

  it("should return true for any class starting with bg-clip-", () => {
    expect(isBackgroundClipClass("bg-clip-")).toBe(true);
    expect(isBackgroundClipClass("bg-clip-invalid")).toBe(true);
  });

  it("should return false for bg-clip without dash", () => {
    expect(isBackgroundClipClass("bg-clip")).toBe(false);
  });
});
