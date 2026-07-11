import { describe, expect, it } from "vitest";
import { isBackgroundOriginClass } from "./isBackgroundOriginClass";

describe("isBackgroundOriginClass", () => {
  it("should return true for origin classes", () => {
    expect(isBackgroundOriginClass("bg-origin-border")).toBe(true);
    expect(isBackgroundOriginClass("bg-origin-padding")).toBe(true);
    expect(isBackgroundOriginClass("bg-origin-content")).toBe(true);
  });

  it("should return false for non-origin classes", () => {
    expect(isBackgroundOriginClass("bg-red-500")).toBe(false);
    expect(isBackgroundOriginClass("bg-blue-600")).toBe(false);
    expect(isBackgroundOriginClass("bg-none")).toBe(false);
    expect(isBackgroundOriginClass("bg-cover")).toBe(false);
    expect(isBackgroundOriginClass("bg-contain")).toBe(false);
    expect(isBackgroundOriginClass("bg-center")).toBe(false);
    expect(isBackgroundOriginClass("bg-repeat")).toBe(false);
    expect(isBackgroundOriginClass("bg-fixed")).toBe(false);
    expect(isBackgroundOriginClass("bg-clip-border")).toBe(false);
    expect(isBackgroundOriginClass("bg-clip-text")).toBe(false);
  });

  it("should return false for gradient stop classes", () => {
    expect(isBackgroundOriginClass("from-red-500")).toBe(false);
    expect(isBackgroundOriginClass("via-blue-500")).toBe(false);
    expect(isBackgroundOriginClass("to-green-500")).toBe(false);
  });

  it("should return false for non-background classes", () => {
    expect(isBackgroundOriginClass("text-red-500")).toBe(false);
    expect(isBackgroundOriginClass("p-4")).toBe(false);
    expect(isBackgroundOriginClass("m-2")).toBe(false);
    expect(isBackgroundOriginClass("flex")).toBe(false);
    expect(isBackgroundOriginClass("")).toBe(false);
  });

  it("should return true for any class starting with bg-origin-", () => {
    expect(isBackgroundOriginClass("bg-origin-")).toBe(true);
    expect(isBackgroundOriginClass("bg-origin-invalid")).toBe(true);
  });

  it("should return false for bg-origin without dash", () => {
    expect(isBackgroundOriginClass("bg-origin")).toBe(false);
  });
});
