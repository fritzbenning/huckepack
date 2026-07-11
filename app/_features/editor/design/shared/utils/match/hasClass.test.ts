import { describe, expect, it } from "vitest";
import { hasClass } from "./hasClass";

describe("hasClass", () => {
  it("should return true when class exists in classTokens", () => {
    expect(hasClass(["flex", "items-center"], "flex")).toBe(true);
    expect(hasClass(["w-10", "h-20"], "w-10")).toBe(true);
  });

  it("should return false when class does not exist in classTokens", () => {
    expect(hasClass(["flex", "items-center"], "grid")).toBe(false);
    expect(hasClass(["w-10"], "h-20")).toBe(false);
  });

  it("should return false when classTokens is null", () => {
    expect(hasClass(null, "flex")).toBe(false);
  });

  it("should return false when classTokens is empty", () => {
    expect(hasClass([], "flex")).toBe(false);
  });

  it("should handle exact match", () => {
    expect(hasClass(["flex"], "flex")).toBe(true);
  });

  it("should handle partial match correctly (should be false)", () => {
    expect(hasClass(["flex"], "flex-col")).toBe(false);
    expect(hasClass(["flex-col"], "flex")).toBe(false);
  });

  it("should handle duplicate classes", () => {
    expect(hasClass(["flex", "flex", "items-center"], "flex")).toBe(true);
  });

  it("should handle empty string class name", () => {
    expect(hasClass(["flex", ""], "")).toBe(true);
    expect(hasClass(["flex"], "")).toBe(false);
  });

  it("should handle case-sensitive matching", () => {
    expect(hasClass(["Flex"], "flex")).toBe(false);
    expect(hasClass(["flex"], "Flex")).toBe(false);
  });
});

