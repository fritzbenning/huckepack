import { describe, expect, it } from "vitest";
import { extractColorValue } from "./extractColorValue";

describe("extractColorValue", () => {
  describe("prefix matching", () => {
    it("should return null if className does not start with prefix", () => {
      expect(extractColorValue("text-red-500", "bg")).toBeNull();
    });

    it("should return null if className is exactly the prefix", () => {
      expect(extractColorValue("bg", "bg")).toBeNull();
    });

    it("should handle className that starts with prefix", () => {
      const result = extractColorValue("bg-red-500", "bg");
      expect(result).not.toBeNull();
    });
  });

  describe("arbitrary values", () => {
    it("should parse arbitrary value with brackets", () => {
      const result = extractColorValue("bg-[#ff0000]", "bg");
      expect(result).toEqual({
        isArbitrary: true,
        arbitraryValue: "#ff0000",
      });
    });

    it("should parse arbitrary value with rgb", () => {
      const result = extractColorValue("bg-[rgb(255,0,0)]", "bg");
      expect(result).toEqual({
        isArbitrary: true,
        arbitraryValue: "rgb(255,0,0)",
      });
    });

    it("should parse arbitrary value with rgba", () => {
      const result = extractColorValue("text-[rgba(255,0,0,0.5)]", "text");
      expect(result).toEqual({
        isArbitrary: true,
        arbitraryValue: "rgba(255,0,0,0.5)",
      });
    });

    it("should handle arbitrary value with spaces", () => {
      const result = extractColorValue("bg-[var(--my-color)]", "bg");
      expect(result).toEqual({
        isArbitrary: true,
        arbitraryValue: "var(--my-color)",
      });
    });
  });

  describe("keyword parsing", () => {
    it("should parse single keyword", () => {
      const result = extractColorValue("bg-transparent", "bg");
      expect(result).toEqual({
        keyword: "transparent",
        isArbitrary: false,
      });
    });

    it("should parse keyword with different prefix", () => {
      const result = extractColorValue("text-current", "text");
      expect(result).toEqual({
        keyword: "current",
        isArbitrary: false,
      });
    });

    it("should parse keyword like white", () => {
      const result = extractColorValue("bg-white", "bg");
      expect(result).toEqual({
        keyword: "white",
        isArbitrary: false,
      });
    });

    it("should parse keyword like black", () => {
      const result = extractColorValue("border-black", "border");
      expect(result).toEqual({
        keyword: "black",
        isArbitrary: false,
      });
    });
  });

  describe("color and shade parsing", () => {
    it("should parse color with shade", () => {
      const result = extractColorValue("bg-red-500", "bg");
      expect(result).toEqual({
        color: "red",
        shade: 500,
        isArbitrary: false,
      });
    });

    it("should parse different colors", () => {
      const redResult = extractColorValue("bg-red-500", "bg");
      const blueResult = extractColorValue("bg-blue-600", "bg");
      const greenResult = extractColorValue("bg-green-400", "bg");

      expect(redResult?.color).toBe("red");
      expect(blueResult?.color).toBe("blue");
      expect(greenResult?.color).toBe("green");
    });

    it("should parse different shades", () => {
      const shade50 = extractColorValue("bg-red-50", "bg");
      const shade500 = extractColorValue("bg-red-500", "bg");
      const shade950 = extractColorValue("bg-red-950", "bg");

      expect(shade50?.shade).toBe(50);
      expect(shade500?.shade).toBe(500);
      expect(shade950?.shade).toBe(950);
    });

    it("should handle three-digit shades", () => {
      const result = extractColorValue("bg-slate-100", "bg");
      expect(result?.shade).toBe(100);
    });
  });

  describe("color with shade and opacity", () => {
    it("should parse color with shade and opacity", () => {
      const result = extractColorValue("bg-red-500-50", "bg");
      expect(result).toEqual({
        color: "red",
        shade: 500,
        opacity: 50,
        isArbitrary: false,
      });
    });

    it("should parse different opacity values", () => {
      const opacity10 = extractColorValue("bg-blue-600-10", "bg");
      const opacity50 = extractColorValue("bg-blue-600-50", "bg");
      const opacity100 = extractColorValue("bg-blue-600-100", "bg");

      expect(opacity10?.opacity).toBe(10);
      expect(opacity50?.opacity).toBe(50);
      expect(opacity100?.opacity).toBe(100);
    });
  });

  describe("edge cases", () => {
    it("should return null for invalid format with non-numeric shade", () => {
      const result = extractColorValue("bg-red-abc", "bg");
      expect(result).toBeNull();
    });

    it("should return null for invalid format with non-numeric opacity", () => {
      const result = extractColorValue("bg-red-500-abc", "bg");
      expect(result).toBeNull();
    });

    it("should return null for empty suffix", () => {
      const result = extractColorValue("bg-", "bg");
      expect(result).toBeNull();
    });

    it("should handle className with multiple dashes that don't match pattern", () => {
      const result = extractColorValue("bg-red-blue-green", "bg");
      expect(result).toBeNull();
    });

    it("should handle prefix without dash separator", () => {
      const result = extractColorValue("bgred-500", "bg");
      expect(result).toBeNull();
    });

    it("should handle very long class names", () => {
      const result = extractColorValue("bg-red-500-50-extra", "bg");
      expect(result).toBeNull();
    });
  });

  describe("different prefixes", () => {
    it("should work with text prefix", () => {
      const result = extractColorValue("text-blue-500", "text");
      expect(result).toEqual({
        color: "blue",
        shade: 500,
        isArbitrary: false,
      });
    });

    it("should work with border prefix", () => {
      const result = extractColorValue("border-green-600", "border");
      expect(result).toEqual({
        color: "green",
        shade: 600,
        isArbitrary: false,
      });
    });

    it("should work with ring prefix", () => {
      const result = extractColorValue("ring-purple-400", "ring");
      expect(result).toEqual({
        color: "purple",
        shade: 400,
        isArbitrary: false,
      });
    });
  });
});
