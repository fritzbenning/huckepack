import { describe, expect, it } from "vitest";
import { getColorClasses } from "./getColorClasses";

describe("getColorClasses", () => {
  it("should generate classes for all Tailwind colors and shades", () => {
    const result = getColorClasses("bg");
    expect(result.length).toBe(24 * 11);
    expect(result).toContain("bg-slate-50");
    expect(result).toContain("bg-slate-500");
    expect(result).toContain("bg-slate-950");
    expect(result).toContain("bg-red-500");
    expect(result).toContain("bg-blue-600");
  });

  it("should include keyword classes when provided", () => {
    const result = getColorClasses("bg", ["transparent", "current", "inherit"]);
    expect(result).toContain("bg-transparent");
    expect(result).toContain("bg-current");
    expect(result).toContain("bg-inherit");
  });

  it("should generate classes with different prefixes", () => {
    const bgResult = getColorClasses("bg");
    const textResult = getColorClasses("text");
    const borderResult = getColorClasses("border");

    expect(bgResult[0]).toBe("bg-slate-50");
    expect(textResult[0]).toBe("text-slate-50");
    expect(borderResult[0]).toBe("border-slate-50");
  });

  it("should include all Tailwind color names", () => {
    const result = getColorClasses("bg");
    const colors = [
      "slate",
      "gray",
      "zinc",
      "neutral",
      "stone",
      "red",
      "orange",
      "amber",
      "yellow",
      "lime",
      "green",
      "emerald",
      "teal",
      "cyan",
      "sky",
      "blue",
      "indigo",
      "violet",
      "purple",
      "fuchsia",
      "pink",
      "rose",
    ];

    for (const color of colors) {
      expect(result).toContain(`bg-${color}-500`);
    }
  });

  it("should include all shade values", () => {
    const result = getColorClasses("bg");
    const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    for (const shade of shades) {
      expect(result).toContain(`bg-red-${shade}`);
    }
  });

  it("should handle empty keywords array", () => {
    const result = getColorClasses("bg", []);
    expect(result.length).toBe(24 * 11);
    expect(result.every((cls) => !cls.includes("transparent"))).toBe(true);
  });

  it("should handle multiple keywords", () => {
    const result = getColorClasses("text", ["transparent", "current", "white", "black"]);
    expect(result).toContain("text-transparent");
    expect(result).toContain("text-current");
    expect(result).toContain("text-white");
    expect(result).toContain("text-black");
  });

  it("should generate correct number of classes", () => {
    const result = getColorClasses("bg", ["transparent", "current"]);
    expect(result.length).toBe(24 * 11 + 2);
  });

  it("should maintain order: colors first, then keywords", () => {
    const result = getColorClasses("bg", ["transparent"]);
    const colorClasses = result.slice(0, -1);
    const keywordClass = result[result.length - 1];

    expect(colorClasses.every((cls) => cls.startsWith("bg-") && cls.includes("-"))).toBe(true);
    expect(keywordClass).toBe("bg-transparent");
  });

  it("should handle prefix with dash", () => {
    const result = getColorClasses("bg-", ["transparent"]);
    expect(result[0]).toBe("bg--slate-50");
    expect(result[result.length - 1]).toBe("bg--transparent");
  });

  it("should handle empty prefix", () => {
    const result = getColorClasses("", ["transparent"]);
    expect(result[0]).toBe("-slate-50");
    expect(result[result.length - 1]).toBe("-transparent");
  });
});

