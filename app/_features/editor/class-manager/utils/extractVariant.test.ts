import { describe, expect, it } from "vitest";
import { extractVariant } from "./extractVariant";

describe("extractVariant", () => {
  it("should extract variant from className with variant prefix", () => {
    const result = extractVariant("md:flex-row");
    expect(result).toEqual({
      variant: "md:",
      base: "flex-row",
    });
  });

  it("should return empty variant for className without variant", () => {
    const result = extractVariant("flex-row");
    expect(result).toEqual({
      variant: "",
      base: "flex-row",
    });
  });

  it("should handle complex variant prefixes", () => {
    const result = extractVariant("hover:focus:bg-blue-500");
    expect(result).toEqual({
      variant: "hover:",
      base: "focus:bg-blue-500",
    });
  });

  it("should handle variant with dash in prefix", () => {
    const result = extractVariant("sm-md:flex");
    expect(result).toEqual({
      variant: "sm-md:",
      base: "flex",
    });
  });

  it("should handle className starting with @", () => {
    const result = extractVariant("@container:flex");
    expect(result).toEqual({
      variant: "@container:",
      base: "flex",
    });
  });

  it("should return empty variant and full className when no match", () => {
    const result = extractVariant("some-class");
    expect(result).toEqual({
      variant: "",
      base: "some-class",
    });
  });

  it("should handle empty string", () => {
    const result = extractVariant("");
    expect(result).toEqual({
      variant: "",
      base: "",
    });
  });
});

