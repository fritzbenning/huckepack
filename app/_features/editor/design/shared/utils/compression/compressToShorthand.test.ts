import { describe, expect, it } from "vitest";
import { compressToShorthand } from "./compressToShorthand";

describe("compressToShorthand", () => {
  describe("size shorthand", () => {
    it("should compress w-10 and h-10 to size-10", () => {
      const result = compressToShorthand(["w-10", "h-10"]);
      expect(result).toEqual({
        shorthand: "size",
        compressed: "size-10",
        expanded: ["w-10", "h-10"],
      });
    });

    it("should compress w-full and h-full to size-full", () => {
      const result = compressToShorthand(["w-full", "h-full"]);
      expect(result).toEqual({
        shorthand: "size",
        compressed: "size-full",
        expanded: ["w-full", "h-full"],
      });
    });

    it("should compress w-1/2 and h-1/2 to size-1/2", () => {
      const result = compressToShorthand(["w-1/2", "h-1/2"]);
      expect(result).toEqual({
        shorthand: "size",
        compressed: "size-1/2",
        expanded: ["w-1/2", "h-1/2"],
      });
    });

    it("should handle different order", () => {
      const result = compressToShorthand(["h-10", "w-10"]);
      expect(result).toEqual({
        shorthand: "size",
        compressed: "size-10",
        expanded: ["w-10", "h-10"],
      });
    });
  });

  describe("inset-x shorthand", () => {
    it("should compress left-10 and right-10 to inset-x-10", () => {
      const result = compressToShorthand(["left-10", "right-10"]);
      expect(result).toEqual({
        shorthand: "inset-x",
        compressed: "inset-x-10",
        expanded: ["left-10", "right-10"],
      });
    });

    it("should compress left-0 and right-0 to inset-x-0", () => {
      const result = compressToShorthand(["left-0", "right-0"]);
      expect(result).toEqual({
        shorthand: "inset-x",
        compressed: "inset-x-0",
        expanded: ["left-0", "right-0"],
      });
    });
  });

  describe("inset-y shorthand", () => {
    it("should compress top-10 and bottom-10 to inset-y-10", () => {
      const result = compressToShorthand(["top-10", "bottom-10"]);
      expect(result).toEqual({
        shorthand: "inset-y",
        compressed: "inset-y-10",
        expanded: ["top-10", "bottom-10"],
      });
    });

    it("should compress top-0 and bottom-0 to inset-y-0", () => {
      const result = compressToShorthand(["top-0", "bottom-0"]);
      expect(result).toEqual({
        shorthand: "inset-y",
        compressed: "inset-y-0",
        expanded: ["top-0", "bottom-0"],
      });
    });
  });

  describe("inset shorthand", () => {
    it("should compress all four directions to inset-10", () => {
      const result = compressToShorthand(["top-10", "right-10", "bottom-10", "left-10"]);
      expect(result).toEqual({
        shorthand: "inset",
        compressed: "inset-10",
        expanded: ["top-10", "right-10", "bottom-10", "left-10"],
      });
    });

    it("should compress all four directions in different order", () => {
      const result = compressToShorthand(["left-5", "top-5", "bottom-5", "right-5"]);
      expect(result).toEqual({
        shorthand: "inset",
        compressed: "inset-5",
        expanded: ["top-5", "right-5", "bottom-5", "left-5"],
      });
    });
  });

  describe("with variants", () => {
    it("should preserve hover variant", () => {
      const result = compressToShorthand(["hover:w-10", "hover:h-10"]);
      expect(result).toEqual({
        shorthand: "size",
        compressed: "hover:size-10",
        expanded: ["hover:w-10", "hover:h-10"],
      });
    });

    it("should preserve focus variant", () => {
      const result = compressToShorthand(["focus:left-5", "focus:right-5"]);
      expect(result).toEqual({
        shorthand: "inset-x",
        compressed: "focus:inset-x-5",
        expanded: ["focus:left-5", "focus:right-5"],
      });
    });

    it("should preserve responsive variants", () => {
      const result = compressToShorthand(["sm:w-10", "sm:h-10"]);
      expect(result).toEqual({
        shorthand: "size",
        compressed: "sm:size-10",
        expanded: ["sm:w-10", "sm:h-10"],
      });
    });

    it("should preserve complex variants", () => {
      const result = compressToShorthand(["hover:w-full", "hover:h-full"]);
      expect(result).toEqual({
        shorthand: "size",
        compressed: "hover:size-full",
        expanded: ["hover:w-full", "hover:h-full"],
      });
    });

    it("should not compress classes with different variants", () => {
      const result = compressToShorthand(["w-10", "hover:h-10"]);
      expect(result).toBeNull();
    });

    it("should not compress classes with mixed variants", () => {
      const result = compressToShorthand(["hover:w-10", "focus:h-10"]);
      expect(result).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("should return null for empty array", () => {
      expect(compressToShorthand([])).toBeNull();
    });

    it("should return null for single class", () => {
      expect(compressToShorthand(["w-10"])).toBeNull();
      expect(compressToShorthand(["h-10"])).toBeNull();
    });

    it("should return null for classes with different suffixes", () => {
      expect(compressToShorthand(["w-10", "h-20"])).toBeNull();
      expect(compressToShorthand(["left-5", "right-10"])).toBeNull();
      expect(compressToShorthand(["top-10", "bottom-20"])).toBeNull();
    });

    it("should return null for classes that don't match any shorthand", () => {
      expect(compressToShorthand(["w-10", "h-10", "p-5"])).toBeNull();
      expect(compressToShorthand(["random-1", "random-2"])).toBeNull();
    });

    it("should return null for partial matches", () => {
      expect(compressToShorthand(["w-10", "h-10", "left-10"])).toBeNull();
      expect(compressToShorthand(["top-10", "right-10", "bottom-10"])).toBeNull();
    });

    it("should return null for wrong number of classes", () => {
      expect(compressToShorthand(["w-10", "h-10", "left-10", "right-10", "top-10"])).toBeNull();
    });

    it("should handle classes with special characters", () => {
      const result = compressToShorthand(["w-[100px]", "h-[100px]"]);
      expect(result).toEqual({
        shorthand: "size",
        compressed: "size-[100px]",
        expanded: ["w-[100px]", "h-[100px]"],
      });
    });

    it("should handle classes with fractions", () => {
      const result = compressToShorthand(["w-1/2", "h-1/2"]);
      expect(result).toEqual({
        shorthand: "size",
        compressed: "size-1/2",
        expanded: ["w-1/2", "h-1/2"],
      });
    });

    it("should return null for classes that start with prefix but aren't exact matches", () => {
      expect(compressToShorthand(["w-10-extra", "h-10"])).toBeNull();
      expect(compressToShorthand(["w-10", "h-10-extra"])).toBeNull();
    });

    it("should handle classes without dashes", () => {
      expect(compressToShorthand(["wfull", "hfull"])).toBeNull();
    });

    it("should return null when classes don't share the same variant", () => {
      expect(compressToShorthand(["w-10", "hover:h-10"])).toBeNull();
      expect(compressToShorthand(["hover:w-10", "h-10"])).toBeNull();
    });

    it("should handle multiple classes with same prefix but different suffixes", () => {
      expect(compressToShorthand(["w-10", "w-20", "h-10"])).toBeNull();
    });

    it("should return null for duplicate classes", () => {
      expect(compressToShorthand(["w-10", "w-10"])).toBeNull();
    });
  });

  describe("priority", () => {
    it("should prefer inset over inset-x and inset-y when all match", () => {
      const result = compressToShorthand(["top-10", "right-10", "bottom-10", "left-10"]);
      expect(result?.shorthand).toBe("inset");
    });

    it("should prefer inset-x over size when both could match", () => {
      const result = compressToShorthand(["left-10", "right-10"]);
      expect(result?.shorthand).toBe("inset-x");
    });
  });
});

