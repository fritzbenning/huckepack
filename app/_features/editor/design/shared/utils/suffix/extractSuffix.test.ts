import { describe, expect, it } from "vitest";
import { extractSuffix } from "./extractSuffix";

describe("extractSuffix", () => {
  it("should extract suffix from class with prefix", () => {
    expect(extractSuffix("w-10", "w")).toBe("10");
    expect(extractSuffix("h-20", "h")).toBe("20");
    expect(extractSuffix("top-5", "top")).toBe("5");
    expect(extractSuffix("left-0", "left")).toBe("0");
  });

  it("should handle prefix with trailing dash", () => {
    expect(extractSuffix("w-10", "w-")).toBe("10");
    expect(extractSuffix("h-20", "h-")).toBe("20");
  });

  it("should handle prefix without trailing dash", () => {
    expect(extractSuffix("w-10", "w")).toBe("10");
    expect(extractSuffix("h-20", "h")).toBe("20");
  });

  it("should return null for class that does not start with prefix", () => {
    expect(extractSuffix("h-10", "w")).toBeNull();
    expect(extractSuffix("w-10", "h")).toBeNull();
    expect(extractSuffix("top-5", "bottom")).toBeNull();
  });

  it("should return null for exact prefix match without suffix", () => {
    expect(extractSuffix("w", "w")).toBeNull();
    expect(extractSuffix("h", "h")).toBeNull();
  });

  it("should return empty string for prefix with trailing dash but no suffix", () => {
    expect(extractSuffix("w-", "w")).toBe("");
  });

  it("should handle complex suffixes", () => {
    expect(extractSuffix("w-1/2", "w")).toBe("1/2");
    expect(extractSuffix("w-1/3", "w")).toBe("1/3");
    expect(extractSuffix("w-screen", "w")).toBe("screen");
    expect(extractSuffix("w-full", "w")).toBe("full");
    expect(extractSuffix("w-[100px]", "w")).toBe("[100px]");
  });

  it("should handle empty string", () => {
    expect(extractSuffix("", "w")).toBeNull();
    expect(extractSuffix("", "")).toBeNull();
  });

  it("should handle empty prefix", () => {
    expect(extractSuffix("w-10", "")).toBeNull();
  });

  it("should handle prefix longer than class name", () => {
    expect(extractSuffix("w", "width")).toBeNull();
    expect(extractSuffix("h", "height")).toBeNull();
  });

  it("should handle case sensitivity", () => {
    expect(extractSuffix("w-10", "W")).toBeNull();
    expect(extractSuffix("W-10", "w")).toBeNull();
  });

  it("should handle classes with multiple dashes", () => {
    expect(extractSuffix("w-1/2", "w")).toBe("1/2");
    expect(extractSuffix("inset-x-5", "inset-x")).toBe("5");
    expect(extractSuffix("inset-y-10", "inset-y")).toBe("10");
  });

  it("should handle numeric prefixes", () => {
    expect(extractSuffix("col-1", "col")).toBe("1");
    expect(extractSuffix("grid-cols-3", "grid-cols")).toBe("3");
  });

  it("should handle special characters in suffix", () => {
    expect(extractSuffix("w-[100px]", "w")).toBe("[100px]");
    expect(extractSuffix("text-[#fff]", "text")).toBe("[#fff]");
  });

  it("should return null for partial prefix match", () => {
    expect(extractSuffix("width-10", "w")).toBeNull();
    expect(extractSuffix("height-20", "h")).toBeNull();
  });

  it("should handle prefix that matches but class doesn't have dash after prefix", () => {
    expect(extractSuffix("w10", "w")).toBeNull();
    expect(extractSuffix("h20", "h")).toBeNull();
  });
});

