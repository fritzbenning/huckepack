import { describe, expect, it } from "vitest";
import { isEnumClass } from "./isEnumClass";

describe("isEnumClass", () => {
  it("should return true when currentClass matches an enum value with prefix", () => {
    const enumValues = ["row", "col"] as const;
    const prefix = "flex";
    const currentClass = "flex-row";

    expect(isEnumClass(enumValues, prefix, currentClass)).toBe(true);
  });

  it("should return true when currentClass matches another enum value", () => {
    const enumValues = ["row", "col", "wrap"] as const;
    const prefix = "flex";
    const currentClass = "flex-col";

    expect(isEnumClass(enumValues, prefix, currentClass)).toBe(true);
  });

  it("should return false when currentClass is null", () => {
    const enumValues = ["row", "col"] as const;
    const prefix = "flex";

    expect(isEnumClass(enumValues, prefix, null)).toBe(false);
  });

  it("should return false when currentClass is empty string", () => {
    const enumValues = ["row", "col"] as const;
    const prefix = "flex";

    expect(isEnumClass(enumValues, prefix, "")).toBe(false);
  });

  it("should return false when enumValues is empty", () => {
    const enumValues = [] as const;
    const prefix = "flex";
    const currentClass = "flex-row";

    expect(isEnumClass(enumValues, prefix, currentClass)).toBe(false);
  });

  it("should return false when currentClass doesn't match any enum value", () => {
    const enumValues = ["row", "col"] as const;
    const prefix = "flex";
    const currentClass = "flex-wrap";

    expect(isEnumClass(enumValues, prefix, currentClass)).toBe(false);
  });

  it("should return false when currentClass matches enum value but without prefix", () => {
    const enumValues = ["row", "col"] as const;
    const prefix = "flex";
    const currentClass = "row";

    expect(isEnumClass(enumValues, prefix, currentClass)).toBe(false);
  });

  it("should return false when currentClass has prefix but wrong enum value", () => {
    const enumValues = ["row", "col"] as const;
    const prefix = "flex";
    const currentClass = "flex-invalid";

    expect(isEnumClass(enumValues, prefix, currentClass)).toBe(false);
  });

  it("should return false when currentClass has wrong prefix", () => {
    const enumValues = ["row", "col"] as const;
    const prefix = "flex";
    const currentClass = "grid-row";

    expect(isEnumClass(enumValues, prefix, currentClass)).toBe(false);
  });

  it("should handle empty prefix", () => {
    const enumValues = ["row", "col"] as const;
    const prefix = "";
    const currentClass = "-row";

    expect(isEnumClass(enumValues, prefix, currentClass)).toBe(true);
  });

  it("should handle enum values with dashes", () => {
    const enumValues = ["red-500", "blue-600"] as const;
    const prefix = "bg";
    const currentClass = "bg-red-500";

    expect(isEnumClass(enumValues, prefix, currentClass)).toBe(true);
  });

  it("should handle numeric enum values", () => {
    const enumValues = ["0", "1", "2"] as const;
    const prefix = "gap";
    const currentClass = "gap-1";

    expect(isEnumClass(enumValues, prefix, currentClass)).toBe(true);
  });

  it("should handle multiple enum values and match correctly", () => {
    const enumValues = ["sm", "md", "lg", "xl"] as const;
    const prefix = "text";
    const currentClass = "text-lg";

    expect(isEnumClass(enumValues, prefix, currentClass)).toBe(true);
  });
});





















