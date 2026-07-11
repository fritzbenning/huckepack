import { describe, expect, it } from "vitest";
import { formatScreenKeyword } from "./formatScreenKeyword";

describe("formatScreenKeyword", () => {
  it("should format width screen keyword", () => {
    expect(formatScreenKeyword("width")).toBe("w-screen");
  });

  it("should format height screen keyword", () => {
    expect(formatScreenKeyword("height")).toBe("h-screen");
  });

  it("should only accept width or height", () => {
    expect(formatScreenKeyword("width")).toBe("w-screen");
    expect(formatScreenKeyword("height")).toBe("h-screen");
  });
});

