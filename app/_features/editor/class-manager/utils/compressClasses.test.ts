import { describe, expect, it, vi } from "vitest";
import { compressClasses } from "./compressClasses";

vi.mock("@editor/design/class-normalizer/shorthand", () => ({
  compressToShorthand: vi.fn((classes: string[]) => {
    const sorted = [...classes].sort();
    if (sorted.length === 2 && sorted[0] === "h-10" && sorted[1] === "w-10") {
      return { shorthand: "size", compressed: "size-10", expanded: ["w-10", "h-10"] };
    }
    if (sorted.length === 2 && sorted[0] === "left-4" && sorted[1] === "right-4") {
      return { shorthand: "inset-x", compressed: "inset-x-4", expanded: ["left-4", "right-4"] };
    }
    if (classes.includes("w-10") && classes.includes("h-10") && classes.length === 2) {
      return { shorthand: "size", compressed: "size-10", expanded: ["w-10", "h-10"] };
    }
    if (classes.includes("left-4") && classes.includes("right-4") && classes.length === 2) {
      return { shorthand: "inset-x", compressed: "inset-x-4", expanded: ["left-4", "right-4"] };
    }
    return null;
  }),
  expandShorthandClass: vi.fn((cls: string) => {
    if (cls === "size-10") {
      return ["w-10", "h-10"];
    }
    if (cls === "inset-x-4") {
      return ["left-4", "right-4"];
    }
    return [cls];
  }),
  extractSuffix: vi.fn((className: string, prefix: string) => {
    if (!className.startsWith(prefix)) {
      return null;
    }
    const exactPrefix = prefix.endsWith("-") ? prefix : `${prefix}-`;
    if (!className.startsWith(exactPrefix)) {
      return null;
    }
    return className.substring(exactPrefix.length);
  }),
}));

vi.mock("@editor/design/class-normalizer/shorthand/constants", () => ({
  SHORTHAND_REGISTRY: [
    { shorthand: "size", expandsTo: ["w", "h"] },
    { shorthand: "inset-x", expandsTo: ["left", "right"] },
  ],
}));

describe("compressClasses", () => {
  it("should compress matching width and height classes", () => {
    const result = compressClasses(["w-10", "h-10", "p-4"]);
    expect(result).toContain("size-10");
    expect(result).not.toContain("w-10");
    expect(result).not.toContain("h-10");
    expect(result).toContain("p-4");
  });

  it("should compress matching left and right classes", () => {
    const result = compressClasses(["left-4", "right-4", "top-2"]);
    expect(result).toContain("inset-x-4");
    expect(result).not.toContain("left-4");
    expect(result).not.toContain("right-4");
    expect(result).toContain("top-2");
  });

  it("should not compress when classes don't match", () => {
    const result = compressClasses(["w-10", "h-20", "p-4"]);
    expect(result).toContain("w-10");
    expect(result).toContain("h-20");
    expect(result).toContain("p-4");
  });

  it("should handle empty array", () => {
    const result = compressClasses([]);
    expect(result).toEqual([]);
  });

  it("should handle classes without matches", () => {
    const result = compressClasses(["p-4", "m-2"]);
    expect(result).toEqual(["p-4", "m-2"]);
  });

  it("should handle variant prefixes", () => {
    const result = compressClasses(["md:w-10", "md:h-10"]);
    expect(result.length).toBeGreaterThan(0);
  });

  it("should not duplicate classes", () => {
    const result = compressClasses(["w-10", "h-10", "w-10"]);
    const unique = new Set(result);
    expect(result.length).toBe(unique.size);
  });
});
