import { beforeEach, describe, expect, it, vi } from "vitest";
import { splitStringLiteral } from "./splitStringLiteral";

// Mock dependencies
vi.mock("@ast/utils", () => ({
  splitClassTokens: vi.fn(),
}));

describe("splitStringLiteral", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should split string literal using splitClassTokens", async () => {
    const mockTokens = ["class1", "class2", "class3"];
    const { splitClassTokens } = vi.mocked(await import("@ast/utils"));
    
    splitClassTokens.mockReturnValue(mockTokens);

    const result = splitStringLiteral("class1 class2 class3");

    expect(result).toBe(mockTokens);
    expect(splitClassTokens).toHaveBeenCalledWith("class1 class2 class3");
  });

  it("should handle empty string", async () => {
    const mockTokens: string[] = [];
    const { splitClassTokens } = vi.mocked(await import("@ast/utils"));
    
    splitClassTokens.mockReturnValue(mockTokens);

    const result = splitStringLiteral("");

    expect(result).toBe(mockTokens);
    expect(splitClassTokens).toHaveBeenCalledWith("");
  });

  it("should handle single token", async () => {
    const mockTokens = ["single-class"];
    const { splitClassTokens } = vi.mocked(await import("@ast/utils"));
    
    splitClassTokens.mockReturnValue(mockTokens);

    const result = splitStringLiteral("single-class");

    expect(result).toBe(mockTokens);
    expect(splitClassTokens).toHaveBeenCalledWith("single-class");
  });

  it("should handle whitespace-only string", async () => {
    const mockTokens: string[] = [];
    const { splitClassTokens } = vi.mocked(await import("@ast/utils"));
    
    splitClassTokens.mockReturnValue(mockTokens);

    const result = splitStringLiteral("   \n\t  ");

    expect(result).toBe(mockTokens);
    expect(splitClassTokens).toHaveBeenCalledWith("   \n\t  ");
  });

  it("should handle string with multiple spaces", async () => {
    const mockTokens = ["class1", "class2", "class3"];
    const { splitClassTokens } = vi.mocked(await import("@ast/utils"));
    
    splitClassTokens.mockReturnValue(mockTokens);

    const result = splitStringLiteral("class1    class2   class3");

    expect(result).toBe(mockTokens);
    expect(splitClassTokens).toHaveBeenCalledWith("class1    class2   class3");
  });

  it("should handle string with leading and trailing spaces", async () => {
    const mockTokens = ["class1", "class2"];
    const { splitClassTokens } = vi.mocked(await import("@ast/utils"));
    
    splitClassTokens.mockReturnValue(mockTokens);

    const result = splitStringLiteral("  class1 class2  ");

    expect(result).toBe(mockTokens);
    expect(splitClassTokens).toHaveBeenCalledWith("  class1 class2  ");
  });

  it("should handle string with special characters in class names", async () => {
    const mockTokens = ["class-with-dashes", "class_with_underscores", "class.with.dots"];
    const { splitClassTokens } = vi.mocked(await import("@ast/utils"));
    
    splitClassTokens.mockReturnValue(mockTokens);

    const result = splitStringLiteral("class-with-dashes class_with_underscores class.with.dots");

    expect(result).toBe(mockTokens);
    expect(splitClassTokens).toHaveBeenCalledWith("class-with-dashes class_with_underscores class.with.dots");
  });

  it("should handle string with mixed whitespace characters", async () => {
    const mockTokens = ["class1", "class2", "class3"];
    const { splitClassTokens } = vi.mocked(await import("@ast/utils"));
    
    splitClassTokens.mockReturnValue(mockTokens);

    const result = splitStringLiteral("class1\tclass2\nclass3");

    expect(result).toBe(mockTokens);
    expect(splitClassTokens).toHaveBeenCalledWith("class1\tclass2\nclass3");
  });

  it("should handle duplicate class names", async () => {
    const mockTokens = ["class1", "class2", "class1", "class2"];
    const { splitClassTokens } = vi.mocked(await import("@ast/utils"));
    
    splitClassTokens.mockReturnValue(mockTokens);

    const result = splitStringLiteral("class1 class2 class1 class2");

    expect(result).toBe(mockTokens);
    expect(splitClassTokens).toHaveBeenCalledWith("class1 class2 class1 class2");
  });

  it("should handle very long string with many classes", async () => {
    const longString = Array.from({ length: 100 }, (_, i) => `class${i}`).join(" ");
    const mockTokens = Array.from({ length: 100 }, (_, i) => `class${i}`);
    const { splitClassTokens } = vi.mocked(await import("@ast/utils"));
    
    splitClassTokens.mockReturnValue(mockTokens);

    const result = splitStringLiteral(longString);

    expect(result).toBe(mockTokens);
    expect(splitClassTokens).toHaveBeenCalledWith(longString);
  });

  it("should handle string with numeric class names", async () => {
    const mockTokens = ["class1", "2xl", "3xl", "4xl"];
    const { splitClassTokens } = vi.mocked(await import("@ast/utils"));
    
    splitClassTokens.mockReturnValue(mockTokens);

    const result = splitStringLiteral("class1 2xl 3xl 4xl");

    expect(result).toBe(mockTokens);
    expect(splitClassTokens).toHaveBeenCalledWith("class1 2xl 3xl 4xl");
  });
});