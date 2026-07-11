import { describe, expect, it } from "vitest";
import { parseScreenKeyword } from "./parseScreenKeyword";

describe("parseScreenKeyword", () => {
  describe("width dimension", () => {
    it("should parse w-screen", () => {
      const result = parseScreenKeyword("w-screen", "width");
      expect(result).toEqual({ value: 100, unit: "vw" });
    });

    it("should parse min-w-screen", () => {
      const result = parseScreenKeyword("min-w-screen", "width");
      expect(result).toEqual({ value: 100, unit: "vw" });
    });

    it("should parse max-w-screen", () => {
      const result = parseScreenKeyword("max-w-screen", "width");
      expect(result).toEqual({ value: 100, unit: "vw" });
    });
  });

  describe("height dimension", () => {
    it("should parse h-screen", () => {
      const result = parseScreenKeyword("h-screen", "height");
      expect(result).toEqual({ value: 100, unit: "vh" });
    });

    it("should parse min-h-screen", () => {
      const result = parseScreenKeyword("min-h-screen", "height");
      expect(result).toEqual({ value: 100, unit: "vh" });
    });

    it("should parse max-h-screen", () => {
      const result = parseScreenKeyword("max-h-screen", "height");
      expect(result).toEqual({ value: 100, unit: "vh" });
    });
  });

  describe("invalid inputs", () => {
    it("should return null for non-screen classes", () => {
      expect(parseScreenKeyword("w-10", "width")).toBeNull();
      expect(parseScreenKeyword("h-10", "height")).toBeNull();
      expect(parseScreenKeyword("w-full", "width")).toBeNull();
      expect(parseScreenKeyword("h-full", "height")).toBeNull();
      expect(parseScreenKeyword("screen", "width")).toBeNull();
      expect(parseScreenKeyword("screen", "height")).toBeNull();
    });

    it("should return null for wrong dimension", () => {
      expect(parseScreenKeyword("w-screen", "height")).toBeNull();
      expect(parseScreenKeyword("h-screen", "width")).toBeNull();
      expect(parseScreenKeyword("min-w-screen", "height")).toBeNull();
      expect(parseScreenKeyword("min-h-screen", "width")).toBeNull();
    });

    it("should return null for empty string", () => {
      expect(parseScreenKeyword("", "width")).toBeNull();
      expect(parseScreenKeyword("", "height")).toBeNull();
    });

    it("should return null for partial matches", () => {
      expect(parseScreenKeyword("w-screen-", "width")).toBeNull();
      expect(parseScreenKeyword("w-scre", "width")).toBeNull();
      expect(parseScreenKeyword("screen-w", "width")).toBeNull();
      expect(parseScreenKeyword("h-screen-", "height")).toBeNull();
      expect(parseScreenKeyword("h-scre", "height")).toBeNull();
    });

    it("should return null for classes with variants", () => {
      expect(parseScreenKeyword("hover:w-screen", "width")).toBeNull();
      expect(parseScreenKeyword("sm:w-screen", "width")).toBeNull();
      expect(parseScreenKeyword("md:h-screen", "height")).toBeNull();
    });

    it("should return null for classes with additional suffixes", () => {
      expect(parseScreenKeyword("w-screen-lg", "width")).toBeNull();
      expect(parseScreenKeyword("h-screen-md", "height")).toBeNull();
      expect(parseScreenKeyword("w-screen-100", "width")).toBeNull();
    });

    it("should return null for case variations", () => {
      expect(parseScreenKeyword("W-screen", "width")).toBeNull();
      expect(parseScreenKeyword("w-SCREEN", "width")).toBeNull();
      expect(parseScreenKeyword("W-SCREEN", "width")).toBeNull();
    });

    it("should return null for whitespace", () => {
      expect(parseScreenKeyword(" w-screen", "width")).toBeNull();
      expect(parseScreenKeyword("w-screen ", "width")).toBeNull();
      expect(parseScreenKeyword(" w-screen ", "width")).toBeNull();
    });
  });
});

