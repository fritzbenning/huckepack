import { beforeEach, describe, expect, it, vi } from "vitest";
import { removeClassToken } from "./removeClassToken";

// Mock dependencies
vi.mock("./joinClassTokens", () => ({
  joinClassTokens: vi.fn(),
}));

vi.mock("./splitClassTokens", () => ({
  splitClassTokens: vi.fn(),
}));

describe("removeClassToken", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should remove existing class token", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "target-class", "class2"]);
    joinClassTokens.mockReturnValue("class1 class2");

    const result = removeClassToken("class1 target-class class2", "target-class");

    expect(result).toBe("class1 class2");
    expect(splitClassTokens).toHaveBeenCalledWith("class1 target-class class2");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2"]);
  });

  it("should remove first class token", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["target-class", "class1", "class2"]);
    joinClassTokens.mockReturnValue("class1 class2");

    const result = removeClassToken("target-class class1 class2", "target-class");

    expect(result).toBe("class1 class2");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2"]);
  });

  it("should remove last class token", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "class2", "target-class"]);
    joinClassTokens.mockReturnValue("class1 class2");

    const result = removeClassToken("class1 class2 target-class", "target-class");

    expect(result).toBe("class1 class2");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2"]);
  });

  it("should remove only class token", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["target-class"]);
    joinClassTokens.mockReturnValue("");

    const result = removeClassToken("target-class", "target-class");

    expect(result).toBe("");
    expect(joinClassTokens).toHaveBeenCalledWith([]);
  });

  it("should not remove non-existent class token", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "class2", "class3"]);
    joinClassTokens.mockReturnValue("class1 class2 class3");

    const result = removeClassToken("class1 class2 class3", "nonexistent-class");

    expect(result).toBe("class1 class2 class3");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2", "class3"]);
  });

  it("should handle empty string", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue([]);
    joinClassTokens.mockReturnValue("");

    const result = removeClassToken("", "any-class");

    expect(result).toBe("");
    expect(splitClassTokens).toHaveBeenCalledWith("");
    expect(joinClassTokens).toHaveBeenCalledWith([]);
  });

  it("should handle whitespace-only string", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue([]);
    joinClassTokens.mockReturnValue("");

    const result = removeClassToken("   \n\t  ", "any-class");

    expect(result).toBe("");
    expect(splitClassTokens).toHaveBeenCalledWith("   \n\t  ");
    expect(joinClassTokens).toHaveBeenCalledWith([]);
  });

  it("should remove all instances of duplicate class tokens", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "target-class", "class2", "target-class", "class3"]);
    joinClassTokens.mockReturnValue("class1 class2 class3");

    const result = removeClassToken("class1 target-class class2 target-class class3", "target-class");

    expect(result).toBe("class1 class2 class3");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2", "class3"]);
  });

  it("should handle class token with special characters", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "class-with-dashes_and_underscores.and.dots", "class2"]);
    joinClassTokens.mockReturnValue("class1 class2");

    const result = removeClassToken("class1 class-with-dashes_and_underscores.and.dots class2", "class-with-dashes_and_underscores.and.dots");

    expect(result).toBe("class1 class2");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2"]);
  });

  it("should handle numeric class tokens", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["text-lg", "2xl", "font-bold"]);
    joinClassTokens.mockReturnValue("text-lg font-bold");

    const result = removeClassToken("text-lg 2xl font-bold", "2xl");

    expect(result).toBe("text-lg font-bold");
    expect(joinClassTokens).toHaveBeenCalledWith(["text-lg", "font-bold"]);
  });

  it("should be case-sensitive", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["Class1", "class2", "CLASS1"]);
    joinClassTokens.mockReturnValue("Class1 CLASS1");

    const result = removeClassToken("Class1 class2 CLASS1", "class2");

    expect(result).toBe("Class1 CLASS1");
    expect(joinClassTokens).toHaveBeenCalledWith(["Class1", "CLASS1"]);
  });

  it("should handle empty class token removal", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "", "class2"]);
    joinClassTokens.mockReturnValue("class1 class2");

    const result = removeClassToken("class1  class2", "");

    expect(result).toBe("class1 class2");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2"]);
  });

  it("should handle very long class strings", async () => {
    const allClasses = Array.from({ length: 50 }, (_, i) => `class${i}`);
    const filteredClasses = allClasses.filter(cls => cls !== "class25");
    const allClassesString = allClasses.join(" ");
    const filteredClassesString = filteredClasses.join(" ");

    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(allClasses);
    joinClassTokens.mockReturnValue(filteredClassesString);

    const result = removeClassToken(allClassesString, "class25");

    expect(result).toBe(filteredClassesString);
    expect(joinClassTokens).toHaveBeenCalledWith(filteredClasses);
  });

  it("should handle class token with whitespace", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "class with spaces", "class2"]);
    joinClassTokens.mockReturnValue("class1 class2");

    const result = removeClassToken("class1 class with spaces class2", "class with spaces");

    expect(result).toBe("class1 class2");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2"]);
  });

  it("should handle removing from string with only duplicates", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["target-class", "target-class", "target-class"]);
    joinClassTokens.mockReturnValue("");

    const result = removeClassToken("target-class target-class target-class", "target-class");

    expect(result).toBe("");
    expect(joinClassTokens).toHaveBeenCalledWith([]);
  });

  it("should handle partial matches correctly", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class", "class-extended", "class-prefix"]);
    joinClassTokens.mockReturnValue("class-extended class-prefix");

    const result = removeClassToken("class class-extended class-prefix", "class");

    expect(result).toBe("class-extended class-prefix");
    expect(joinClassTokens).toHaveBeenCalledWith(["class-extended", "class-prefix"]);
  });
});