import { describe, expect, it } from "vitest";
import { getTextClassesByProperty } from "../getTextClassesByProperty";

describe("getTextClassesByProperty", () => {
  it("should filter classes by property", () => {
    const classes = ["text-lg", "text-red-500", "text-left", "text-blue-600"];
    const result = getTextClassesByProperty(classes, "textColor");

    expect(result).toEqual(["text-red-500", "text-blue-600"]);
  });

  it("should filter font size classes", () => {
    const classes = ["text-xs", "text-sm", "text-lg", "text-xl", "text-red-500"];
    const result = getTextClassesByProperty(classes, "fontSize");

    expect(result).toEqual(["text-xs", "text-sm", "text-lg", "text-xl"]);
  });

  it("should filter text align classes", () => {
    const classes = ["text-left", "text-center", "text-right", "text-red-500"];
    const result = getTextClassesByProperty(classes, "textAlign");

    expect(result).toEqual(["text-left", "text-center", "text-right"]);
  });

  it("should return empty array when no classes match", () => {
    const classes = ["text-lg", "text-red-500"];
    const result = getTextClassesByProperty(classes, "textAlign");

    expect(result).toEqual([]);
  });

  it("should return empty array for empty input", () => {
    const classes: string[] = [];
    const result = getTextClassesByProperty(classes, "textColor");

    expect(result).toEqual([]);
  });

  it("should handle mixed text and non-text classes", () => {
    const classes = ["text-lg", "bg-red-500", "text-left", "p-4"];
    const result = getTextClassesByProperty(classes, "fontSize");

    expect(result).toEqual(["text-lg"]);
  });

  it("should handle invalid property names", () => {
    const classes = ["text-lg", "text-red-500"];
    const result = getTextClassesByProperty(classes, "invalidProperty");

    expect(result).toEqual([]);
  });

  it("should handle arbitrary font size values", () => {
    const classes = ["text-[14px]", "text-[1.5rem]", "text-red-500"];
    const result = getTextClassesByProperty(classes, "fontSize");

    expect(result).toEqual(["text-[14px]", "text-[1.5rem]"]);
  });

  it("should handle arbitrary color values", () => {
    const classes = ["text-[#fff]", "text-[rgb(255,0,0)]", "text-lg"];
    const result = getTextClassesByProperty(classes, "textColor");

    expect(result).toEqual(["text-[#fff]", "text-[rgb(255,0,0)]"]);
  });
});
