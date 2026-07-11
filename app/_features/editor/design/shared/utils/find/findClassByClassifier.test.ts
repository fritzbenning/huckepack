import { describe, expect, it, vi } from "vitest";
import { findClassByClassifier } from "./findClassByClassifier";

vi.mock("../classify/classifyClass", () => ({
  classifyClass: vi.fn((cls: string) => {
    if (cls === "bg-red-500") return "backgroundColor";
    if (cls === "text-lg") return "fontSize";
    return null;
  }),
}));

describe("findClassByClassifier", () => {
  it("should find class that matches the feature key", () => {
    const classTokens = ["bg-red-500", "p-4", "m-8"];
    const result = findClassByClassifier(classTokens, "backgroundColor");

    expect(result).toBe("bg-red-500");
  });

  it("should return undefined when no class matches", () => {
    const classTokens = ["p-4", "m-8"];
    const result = findClassByClassifier(classTokens, "backgroundColor");

    expect(result).toBeUndefined();
  });

  it("should return first matching class when multiple match", () => {
    const classTokens = ["text-lg", "text-xl", "p-4"];
    const result = findClassByClassifier(classTokens, "fontSize");

    expect(result).toBe("text-lg");
  });

  it("should return undefined for empty array", () => {
    const result = findClassByClassifier([], "backgroundColor");

    expect(result).toBeUndefined();
  });
});
