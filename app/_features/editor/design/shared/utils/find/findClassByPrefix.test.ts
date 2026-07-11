import { describe, expect, it } from "vitest";
import { findClassByPrefix } from "./findClassByPrefix";

describe("findClassByPrefix", () => {
  it("should find class with matching prefix", () => {
    const classTokens = ["w-4", "h-8", "p-2"];
    const result = findClassByPrefix(classTokens, "w");

    expect(result).toBe("w-4");
  });

  it("should normalize prefix with dash", () => {
    const classTokens = ["w-4", "h-8"];
    const result = findClassByPrefix(classTokens, "w-");

    expect(result).toBe("w-4");
  });

  it("should return prefix itself when it matches exactly", () => {
    const classTokens = ["w", "h-8"];
    const result = findClassByPrefix(classTokens, "w");

    expect(result).toBe("w");
  });

  it("should apply classFilter when provided", () => {
    const classTokens = ["text-lg", "text-red-500", "text-left"];
    const classFilter = (cls: string) => cls.includes("lg") || cls.includes("red");
    const result = findClassByPrefix(classTokens, "text", classFilter);

    expect(result).toBe("text-lg");
  });

  it("should return undefined when classFilter excludes all matches", () => {
    const classTokens = ["text-lg", "text-xl"];
    const classFilter = () => false;
    const result = findClassByPrefix(classTokens, "text", classFilter);

    expect(result).toBeUndefined();
  });

  it("should return undefined when no class matches prefix", () => {
    const classTokens = ["p-4", "m-8"];
    const result = findClassByPrefix(classTokens, "w");

    expect(result).toBeUndefined();
  });

  it("should return first matching class when multiple match", () => {
    const classTokens = ["w-0", "w-1", "w-2"];
    const result = findClassByPrefix(classTokens, "w");

    expect(result).toBe("w-0");
  });

  it("should handle empty array", () => {
    const result = findClassByPrefix([], "w");

    expect(result).toBeUndefined();
  });
});
