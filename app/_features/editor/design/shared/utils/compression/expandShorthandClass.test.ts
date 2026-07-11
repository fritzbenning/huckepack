import { describe, expect, it } from "vitest";
import { expandShorthandClass } from "./expandShorthandClass";

describe("expandShorthandClass", () => {
  describe("size shorthand", () => {
    it("should expand size-10 to w-10 and h-10", () => {
      const result = expandShorthandClass("size-10");
      expect(result).toEqual(["w-10", "h-10"]);
    });

    it("should expand size-full to w-full and h-full", () => {
      const result = expandShorthandClass("size-full");
      expect(result).toEqual(["w-full", "h-full"]);
    });

    it("should expand size-1/2 to w-1/2 and h-1/2", () => {
      const result = expandShorthandClass("size-1/2");
      expect(result).toEqual(["w-1/2", "h-1/2"]);
    });

    it("should expand size-[100px] to w-[100px] and h-[100px]", () => {
      const result = expandShorthandClass("size-[100px]");
      expect(result).toEqual(["w-[100px]", "h-[100px]"]);
    });
  });

  describe("inset-x shorthand", () => {
    it("should expand inset-x-10 to left-10 and right-10", () => {
      const result = expandShorthandClass("inset-x-10");
      expect(result).toEqual(["left-10", "right-10"]);
    });

    it("should expand inset-x-0 to left-0 and right-0", () => {
      const result = expandShorthandClass("inset-x-0");
      expect(result).toEqual(["left-0", "right-0"]);
    });
  });

  describe("inset-y shorthand", () => {
    it("should expand inset-y-10 to top-10 and bottom-10", () => {
      const result = expandShorthandClass("inset-y-10");
      expect(result).toEqual(["top-10", "bottom-10"]);
    });

    it("should expand inset-y-0 to top-0 and bottom-0", () => {
      const result = expandShorthandClass("inset-y-0");
      expect(result).toEqual(["top-0", "bottom-0"]);
    });
  });

  describe("inset shorthand", () => {
    it("should expand inset-10 to top-10, right-10, bottom-10, and left-10", () => {
      const result = expandShorthandClass("inset-10");
      expect(result).toEqual(["top-10", "right-10", "bottom-10", "left-10"]);
    });

    it("should expand inset-0 to all four directions", () => {
      const result = expandShorthandClass("inset-0");
      expect(result).toEqual(["top-0", "right-0", "bottom-0", "left-0"]);
    });
  });

  describe("with variants", () => {
    it("should preserve hover variant", () => {
      const result = expandShorthandClass("hover:size-10");
      expect(result).toEqual(["hover:w-10", "hover:h-10"]);
    });

    it("should preserve focus variant", () => {
      const result = expandShorthandClass("focus:inset-x-5");
      expect(result).toEqual(["focus:left-5", "focus:right-5"]);
    });

    it("should preserve responsive variants", () => {
      const result = expandShorthandClass("sm:size-10");
      expect(result).toEqual(["sm:w-10", "sm:h-10"]);
    });

    it("should preserve multiple variants", () => {
      const result = expandShorthandClass("hover:inset-y-5");
      expect(result).toEqual(["hover:top-5", "hover:bottom-5"]);
    });

    it("should preserve complex variants", () => {
      const result = expandShorthandClass("group-hover:size-full");
      expect(result).toEqual(["group-hover:w-full", "group-hover:h-full"]);
    });
  });

  describe("edge cases", () => {
    it("should return original class if no suffix", () => {
      const result = expandShorthandClass("size-");
      expect(result).toEqual(["size-"]);
    });

    it("should return original class if not a shorthand", () => {
      expect(expandShorthandClass("w-10")).toEqual(["w-10"]);
      expect(expandShorthandClass("h-10")).toEqual(["h-10"]);
      expect(expandShorthandClass("left-5")).toEqual(["left-5"]);
      expect(expandShorthandClass("random-class")).toEqual(["random-class"]);
    });

    it("should handle empty string", () => {
      const result = expandShorthandClass("");
      expect(result).toEqual([""]);
    });

    it("should handle classes that start with shorthand but aren't exact matches", () => {
      expect(expandShorthandClass("size-extra-large")).toEqual(["w-extra-large", "h-extra-large"]);
      expect(expandShorthandClass("inset-x-custom")).toEqual(["left-custom", "right-custom"]);
    });

    it("should handle special characters in suffix", () => {
      const result = expandShorthandClass("size-[100px]");
      expect(result).toEqual(["w-[100px]", "h-[100px]"]);
    });

    it("should handle fractions in suffix", () => {
      const result = expandShorthandClass("size-1/2");
      expect(result).toEqual(["w-1/2", "h-1/2"]);
    });
  });

  describe("regex escaping", () => {
    it("should handle special regex characters in shorthand name", () => {
      expect(expandShorthandClass("size-10")).toEqual(["w-10", "h-10"]);
      expect(expandShorthandClass("inset-x-10")).toEqual(["left-10", "right-10"]);
    });
  });
});

