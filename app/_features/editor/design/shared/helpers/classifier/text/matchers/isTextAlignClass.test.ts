import { describe, expect, it } from "vitest";
import { isTextAlignClass } from "./isTextAlignClass";

describe("isTextAlignClass", () => {
  it("should return true for align classes", () => {
    expect(isTextAlignClass("text-left")).toBe(true);
    expect(isTextAlignClass("text-center")).toBe(true);
    expect(isTextAlignClass("text-right")).toBe(true);
    expect(isTextAlignClass("text-justify")).toBe(true);
    expect(isTextAlignClass("text-start")).toBe(true);
    expect(isTextAlignClass("text-end")).toBe(true);
  });

  it("should return false for non-align classes", () => {
    expect(isTextAlignClass("text-lg")).toBe(false);
    expect(isTextAlignClass("text-xl")).toBe(false);
    expect(isTextAlignClass("text-[14px]")).toBe(false);
    expect(isTextAlignClass("text-red-500")).toBe(false);
    expect(isTextAlignClass("text-blue-600")).toBe(false);
    expect(isTextAlignClass("text-[#fff]")).toBe(false);
    expect(isTextAlignClass("text-transparent")).toBe(false);
  });

  it("should return false for non-text classes", () => {
    expect(isTextAlignClass("bg-red-500")).toBe(false);
    expect(isTextAlignClass("p-4")).toBe(false);
    expect(isTextAlignClass("m-2")).toBe(false);
    expect(isTextAlignClass("flex")).toBe(false);
    expect(isTextAlignClass("")).toBe(false);
  });

  it("should return false for invalid text classes", () => {
    expect(isTextAlignClass("text-")).toBe(false);
    expect(isTextAlignClass("text-invalid")).toBe(false);
    expect(isTextAlignClass("text-unknown-class")).toBe(false);
    expect(isTextAlignClass("text-align-left")).toBe(false);
  });
});

