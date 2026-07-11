import { beforeEach, describe, expect, it, vi } from "vitest";
import { addClassToken } from "./addClassToken";

// Mock dependencies
vi.mock("./joinClassTokens", () => ({
  joinClassTokens: vi.fn(),
}));

vi.mock("./splitClassTokens", () => ({
  splitClassTokens: vi.fn(),
}));

describe("addClassToken", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should add new class token to existing classes", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "class2"]);
    joinClassTokens.mockReturnValue("class1 class2 new-class");

    const result = addClassToken("class1 class2", "new-class");

    expect(result).toBe("class1 class2 new-class");
    expect(splitClassTokens).toHaveBeenCalledWith("class1 class2");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2", "new-class"]);
  });

  it("should not add duplicate class token", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "class2", "existing-class"]);
    joinClassTokens.mockReturnValue("class1 class2 existing-class");

    const result = addClassToken("class1 class2 existing-class", "existing-class");

    expect(result).toBe("class1 class2 existing-class");
    expect(splitClassTokens).toHaveBeenCalledWith("class1 class2 existing-class");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2", "existing-class"]);
  });

  it("should add class token to empty string", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue([]);
    joinClassTokens.mockReturnValue("new-class");

    const result = addClassToken("", "new-class");

    expect(result).toBe("new-class");
    expect(splitClassTokens).toHaveBeenCalledWith("");
    expect(joinClassTokens).toHaveBeenCalledWith(["new-class"]);
  });

  it("should add class token to whitespace-only string", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue([]);
    joinClassTokens.mockReturnValue("new-class");

    const result = addClassToken("   \n\t  ", "new-class");

    expect(result).toBe("new-class");
    expect(splitClassTokens).toHaveBeenCalledWith("   \n\t  ");
    expect(joinClassTokens).toHaveBeenCalledWith(["new-class"]);
  });

  it("should add class token to single existing class", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["existing-class"]);
    joinClassTokens.mockReturnValue("existing-class new-class");

    const result = addClassToken("existing-class", "new-class");

    expect(result).toBe("existing-class new-class");
    expect(splitClassTokens).toHaveBeenCalledWith("existing-class");
    expect(joinClassTokens).toHaveBeenCalledWith(["existing-class", "new-class"]);
  });

  it("should handle class token with special characters", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "class2"]);
    joinClassTokens.mockReturnValue("class1 class2 class-with-dashes_and_underscores.and.dots");

    const result = addClassToken("class1 class2", "class-with-dashes_and_underscores.and.dots");

    expect(result).toBe("class1 class2 class-with-dashes_and_underscores.and.dots");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2", "class-with-dashes_and_underscores.and.dots"]);
  });

  it("should handle numeric class tokens", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["text-lg", "font-bold"]);
    joinClassTokens.mockReturnValue("text-lg font-bold 2xl");

    const result = addClassToken("text-lg font-bold", "2xl");

    expect(result).toBe("text-lg font-bold 2xl");
    expect(joinClassTokens).toHaveBeenCalledWith(["text-lg", "font-bold", "2xl"]);
  });

  it("should handle case-sensitive class tokens", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["Class1", "class2"]);
    joinClassTokens.mockReturnValue("Class1 class2 CLASS1");

    const result = addClassToken("Class1 class2", "CLASS1");

    expect(result).toBe("Class1 class2 CLASS1");
    expect(joinClassTokens).toHaveBeenCalledWith(["Class1", "class2", "CLASS1"]);
  });

  it("should handle empty class token", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "class2"]);
    joinClassTokens.mockReturnValue("class1 class2 ");

    const result = addClassToken("class1 class2", "");

    expect(result).toBe("class1 class2 ");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2", ""]);
  });

  it("should handle multiple existing duplicate classes", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "class2", "class1", "class2"]);
    joinClassTokens.mockReturnValue("class1 class2 class1 class2 new-class");

    const result = addClassToken("class1 class2 class1 class2", "new-class");

    expect(result).toBe("class1 class2 class1 class2 new-class");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2", "class1", "class2", "new-class"]);
  });

  it("should not add when class already exists among duplicates", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "class2", "class1", "existing-class"]);
    joinClassTokens.mockReturnValue("class1 class2 class1 existing-class");

    const result = addClassToken("class1 class2 class1 existing-class", "existing-class");

    expect(result).toBe("class1 class2 class1 existing-class");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2", "class1", "existing-class"]);
  });

  it("should handle very long class strings", async () => {
    const existingClasses = Array.from({ length: 50 }, (_, i) => `class${i}`);
    const expectedClasses = [...existingClasses, "new-class"];
    const existingString = existingClasses.join(" ");
    const expectedString = expectedClasses.join(" ");

    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(existingClasses);
    joinClassTokens.mockReturnValue(expectedString);

    const result = addClassToken(existingString, "new-class");

    expect(result).toBe(expectedString);
    expect(joinClassTokens).toHaveBeenCalledWith(expectedClasses);
  });

  it("should handle class token with whitespace", async () => {
    const { splitClassTokens } = vi.mocked(await import("./splitClassTokens"));
    const { joinClassTokens } = vi.mocked(await import("./joinClassTokens"));

    splitClassTokens.mockReturnValue(["class1", "class2"]);
    joinClassTokens.mockReturnValue("class1 class2 class with spaces");

    const result = addClassToken("class1 class2", "class with spaces");

    expect(result).toBe("class1 class2 class with spaces");
    expect(joinClassTokens).toHaveBeenCalledWith(["class1", "class2", "class with spaces"]);
  });
});