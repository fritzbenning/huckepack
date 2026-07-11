import { describe, expect, it } from "vitest";
import { getBackgroundClassesByProperty } from "./getBackgroundClassesByProperty";

describe("getBackgroundClassesByProperty", () => {
  it("should filter classes by property", () => {
    const classes = ["bg-red-500", "bg-blue-600", "bg-cover", "bg-contain"];
    const result = getBackgroundClassesByProperty(classes, "backgroundColor");

    expect(result).toEqual(["bg-red-500", "bg-blue-600"]);
  });

  it("should filter background size classes", () => {
    const classes = ["bg-cover", "bg-contain", "bg-auto", "bg-red-500"];
    const result = getBackgroundClassesByProperty(classes, "backgroundSize");

    expect(result).toEqual(["bg-cover", "bg-contain", "bg-auto"]);
  });

  it("should filter background position classes", () => {
    const classes = ["bg-center", "bg-top", "bg-bottom", "bg-red-500"];
    const result = getBackgroundClassesByProperty(classes, "backgroundPosition");

    expect(result).toEqual(["bg-center", "bg-top", "bg-bottom"]);
  });

  it("should filter background image classes including gradient stops", () => {
    const classes = ["bg-none", "from-red-500", "via-blue-500", "to-green-500", "bg-red-500"];
    const result = getBackgroundClassesByProperty(classes, "backgroundImage");

    expect(result).toEqual(["bg-none", "from-red-500", "via-blue-500", "to-green-500"]);
  });

  it("should return empty array when no classes match", () => {
    const classes = ["bg-red-500", "bg-blue-600"];
    const result = getBackgroundClassesByProperty(classes, "backgroundSize");

    expect(result).toEqual([]);
  });

  it("should return empty array for empty input", () => {
    const classes: string[] = [];
    const result = getBackgroundClassesByProperty(classes, "backgroundColor");

    expect(result).toEqual([]);
  });

  it("should handle mixed background and non-background classes", () => {
    const classes = ["bg-red-500", "text-lg", "bg-cover", "p-4"];
    const result = getBackgroundClassesByProperty(classes, "backgroundColor");

    expect(result).toEqual(["bg-red-500"]);
  });

  it("should handle invalid property names", () => {
    const classes = ["bg-red-500", "bg-blue-600"];
    const result = getBackgroundClassesByProperty(classes, "invalidProperty");

    expect(result).toEqual([]);
  });
});
