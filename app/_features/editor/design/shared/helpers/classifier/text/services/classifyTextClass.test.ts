import { describe, expect, it } from "vitest";
import { classifyTextClass } from "../classifyTextClass";

describe("classifyTextClass", () => {
  it("should classify font size classes", () => {
    expect(classifyTextClass("text-xs")).toBe("fontSize");
    expect(classifyTextClass("text-sm")).toBe("fontSize");
    expect(classifyTextClass("text-base")).toBe("fontSize");
    expect(classifyTextClass("text-lg")).toBe("fontSize");
    expect(classifyTextClass("text-xl")).toBe("fontSize");
    expect(classifyTextClass("text-2xl")).toBe("fontSize");
    expect(classifyTextClass("text-3xl")).toBe("fontSize");
    expect(classifyTextClass("text-4xl")).toBe("fontSize");
    expect(classifyTextClass("text-5xl")).toBe("fontSize");
    expect(classifyTextClass("text-6xl")).toBe("fontSize");
    expect(classifyTextClass("text-7xl")).toBe("fontSize");
    expect(classifyTextClass("text-8xl")).toBe("fontSize");
    expect(classifyTextClass("text-9xl")).toBe("fontSize");
    expect(classifyTextClass("text-[14px]")).toBe("fontSize");
    expect(classifyTextClass("text-[1.5rem]")).toBe("fontSize");
    expect(classifyTextClass("text-[2em]")).toBe("fontSize");
  });

  it("should classify text color classes", () => {
    expect(classifyTextClass("text-red-500")).toBe("textColor");
    expect(classifyTextClass("text-blue-600")).toBe("textColor");
    expect(classifyTextClass("text-green-400")).toBe("textColor");
    expect(classifyTextClass("text-slate-300")).toBe("textColor");
    expect(classifyTextClass("text-gray-700")).toBe("textColor");
    expect(classifyTextClass("text-[#fff]")).toBe("textColor");
    expect(classifyTextClass("text-[#000000]")).toBe("textColor");
    expect(classifyTextClass("text-[rgb(255,0,0)]")).toBe("textColor");
    expect(classifyTextClass("text-[hsl(0,100%,50%)]")).toBe("textColor");
    expect(classifyTextClass("text-[oklch(0.5,0.2,180)]")).toBe("textColor");
    expect(classifyTextClass("text-transparent")).toBe("textColor");
    expect(classifyTextClass("text-current")).toBe("textColor");
    expect(classifyTextClass("text-inherit")).toBe("textColor");
    expect(classifyTextClass("text-black")).toBe("textColor");
    expect(classifyTextClass("text-white")).toBe("textColor");
  });

  it("should classify text align classes", () => {
    expect(classifyTextClass("text-left")).toBe("textAlign");
    expect(classifyTextClass("text-center")).toBe("textAlign");
    expect(classifyTextClass("text-right")).toBe("textAlign");
    expect(classifyTextClass("text-justify")).toBe("textAlign");
    expect(classifyTextClass("text-start")).toBe("textAlign");
    expect(classifyTextClass("text-end")).toBe("textAlign");
  });

  it("should return null for non-text classes", () => {
    expect(classifyTextClass("bg-red-500")).toBeNull();
    expect(classifyTextClass("p-4")).toBeNull();
    expect(classifyTextClass("m-2")).toBeNull();
    expect(classifyTextClass("flex")).toBeNull();
    expect(classifyTextClass("grid")).toBeNull();
    expect(classifyTextClass("rounded-lg")).toBeNull();
    expect(classifyTextClass("shadow-md")).toBeNull();
    expect(classifyTextClass("border-2")).toBeNull();
    expect(classifyTextClass("hover:text-red-500")).toBeNull();
    expect(classifyTextClass("")).toBeNull();
  });

  it("should return null for invalid text classes", () => {
    expect(classifyTextClass("text-")).toBeNull();
    expect(classifyTextClass("text-invalid")).toBeNull();
    expect(classifyTextClass("text-unknown-class")).toBeNull();
  });

  it("should classify arbitrary values as font size if not a color", () => {
    expect(classifyTextClass("text-[invalid]")).toBe("fontSize");
    expect(classifyTextClass("text-[anything]")).toBe("fontSize");
    expect(classifyTextClass("text-[random-value]")).toBe("fontSize");
  });

  it("should not classify arbitrary values that are colors as font size", () => {
    expect(classifyTextClass("text-[#fff]")).toBe("textColor");
    expect(classifyTextClass("text-[rgb(255,0,0)]")).toBe("textColor");
    expect(classifyTextClass("text-[hsl(0,100%,50%)]")).toBe("textColor");
    expect(classifyTextClass("text-[oklch(0.5,0.2,180)]")).toBe("textColor");
    expect(classifyTextClass("text-[var(--color-primary)]")).toBe("textColor");
  });
});
