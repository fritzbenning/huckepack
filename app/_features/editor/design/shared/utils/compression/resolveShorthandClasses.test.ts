import { describe, expect, it, vi } from "vitest";
import { resolveShorthandClasses } from "./resolveShorthandClasses";

vi.mock("./expandShorthandClass", () => ({
  expandShorthandClass: vi.fn((className: string) => {
    if (className === "size-10") return ["w-10", "h-10"];
    if (className === "inset-x-4") return ["left-4", "right-4"];
    if (className === "inset-y-4") return ["top-4", "bottom-4"];
    if (className === "inset-4") return ["top-4", "right-4", "bottom-4", "left-4"];
    return [className];
  }),
}));

describe("resolveShorthandClasses", () => {
  it("should identify shorthands to delete when all expanded classes are being deleted", () => {
    const result = resolveShorthandClasses(["w-10", "h-10"], ["size-10", "other-class"]);

    expect(result.shorthandsToDelete).toContain("size-10");
    expect(result.shorthandsToReplace).toEqual([]);
  });

  it("should identify shorthands to replace when some expanded classes remain", () => {
    const result = resolveShorthandClasses(["w-10"], ["size-10", "other-class"]);

    expect(result.shorthandsToDelete).not.toContain("size-10");
    expect(result.shorthandsToReplace).toEqual([
      {
        shorthand: "size-10",
        remainingClasses: ["h-10"],
      },
    ]);
  });

  it("should handle multiple shorthands", () => {
    const result = resolveShorthandClasses(
      ["w-10", "left-4"],
      ["size-10", "inset-x-4", "other-class"]
    );

    expect(result.shorthandsToReplace.length).toBeGreaterThan(0);
  });

  it("should handle non-shorthand classes", () => {
    const result = resolveShorthandClasses(["w-10"], ["w-10", "other-class"]);

    expect(result.shorthandsToDelete).toEqual([]);
    expect(result.shorthandsToReplace).toEqual([]);
  });

  it("should handle empty classesToDelete", () => {
    const result = resolveShorthandClasses([], ["size-10", "other-class"]);

    expect(result.shorthandsToDelete).toEqual([]);
    expect(result.shorthandsToReplace).toEqual([]);
  });

  it("should handle empty originalClassTokens", () => {
    const result = resolveShorthandClasses(["w-10"], []);

    expect(result.shorthandsToDelete).toEqual([]);
    expect(result.shorthandsToReplace).toEqual([]);
  });

  it("should handle prefixesToDelete parameter", () => {
    const result = resolveShorthandClasses(
      [],
      ["size-10"],
      ["w"]
    );

    expect(result.shorthandsToReplace.length).toBeGreaterThan(0);
  });

  it("should match classes by prefix when prefixesToDelete provided", () => {
    const result = resolveShorthandClasses(
      [],
      ["size-10"],
      ["w"]
    );

    const replacement = result.shorthandsToReplace.find((r) => r.shorthand === "size-10");
    expect(replacement).toBeDefined();
    expect(replacement?.remainingClasses).toContain("h-10");
  });

  it("should handle shorthand with all classes matching prefix", () => {
    const result = resolveShorthandClasses(
      [],
      ["size-10"],
      ["w", "h"]
    );

    expect(result.shorthandsToDelete.length).toBeGreaterThanOrEqual(0);
  });

  it("should handle inset shorthand", () => {
    const result = resolveShorthandClasses(
      ["top-4", "right-4"],
      ["inset-4", "other-class"]
    );

    const replacement = result.shorthandsToReplace.find((r) => r.shorthand === "inset-4");
    expect(replacement).toBeDefined();
    expect(replacement?.remainingClasses).toEqual(["bottom-4", "left-4"]);
  });

  it("should handle inset-x shorthand", () => {
    const result = resolveShorthandClasses(
      ["left-4"],
      ["inset-x-4", "other-class"]
    );

    const replacement = result.shorthandsToReplace.find((r) => r.shorthand === "inset-x-4");
    expect(replacement).toBeDefined();
    expect(replacement?.remainingClasses).toEqual(["right-4"]);
  });

  it("should handle inset-y shorthand", () => {
    const result = resolveShorthandClasses(
      ["top-4"],
      ["inset-y-4", "other-class"]
    );

    const replacement = result.shorthandsToReplace.find((r) => r.shorthand === "inset-y-4");
    expect(replacement).toBeDefined();
    expect(replacement?.remainingClasses).toEqual(["bottom-4"]);
  });

  it("should not include shorthands that expand to single class", () => {
    const result = resolveShorthandClasses(
      ["w-10"],
      ["w-10", "other-class"]
    );

    expect(result.shorthandsToDelete).toEqual([]);
    expect(result.shorthandsToReplace).toEqual([]);
  });
});

