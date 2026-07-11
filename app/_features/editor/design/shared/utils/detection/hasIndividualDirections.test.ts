import { describe, expect, it } from "vitest";
import { hasIndividualDirections } from "./hasIndividualDirections";

describe("hasIndividualDirections", () => {
  it("should return true when classTokens contains top direction class", () => {
    expect(hasIndividualDirections(["pt-4"], "p")).toBe(true);
    expect(hasIndividualDirections(["mt-2"], "m")).toBe(true);
  });

  it("should return true when classTokens contains right direction class", () => {
    expect(hasIndividualDirections(["pr-4"], "p")).toBe(true);
    expect(hasIndividualDirections(["mr-2"], "m")).toBe(true);
  });

  it("should return true when classTokens contains bottom direction class", () => {
    expect(hasIndividualDirections(["pb-4"], "p")).toBe(true);
    expect(hasIndividualDirections(["mb-2"], "m")).toBe(true);
  });

  it("should return true when classTokens contains left direction class", () => {
    expect(hasIndividualDirections(["pl-4"], "p")).toBe(true);
    expect(hasIndividualDirections(["ml-2"], "m")).toBe(true);
  });

  it("should return false when classTokens is null", () => {
    expect(hasIndividualDirections(null, "p")).toBe(false);
  });

  it("should return false when no direction classes present", () => {
    expect(hasIndividualDirections(["p-4", "other-class"], "p")).toBe(false);
    expect(hasIndividualDirections(["m-2"], "m")).toBe(false);
  });

  it("should handle prefix with trailing dash", () => {
    expect(hasIndividualDirections(["pt-4"], "p")).toBe(true);
    expect(hasIndividualDirections(["mt-2"], "m")).toBe(true);
  });

  it("should handle prefix without trailing dash", () => {
    expect(hasIndividualDirections(["pt-4"], "p")).toBe(true);
    expect(hasIndividualDirections(["mt-2"], "m")).toBe(true);
  });

  it("should handle multiple direction classes", () => {
    expect(hasIndividualDirections(["pt-4", "pb-2"], "p")).toBe(true);
    expect(hasIndividualDirections(["mt-2", "mb-4"], "m")).toBe(true);
  });

  it("should return false for non-direction classes with same prefix", () => {
    expect(hasIndividualDirections(["p-4"], "p")).toBe(false);
    expect(hasIndividualDirections(["m-2"], "m")).toBe(false);
  });

  it("should handle empty classTokens array", () => {
    expect(hasIndividualDirections([], "p")).toBe(false);
  });

  it("should handle classes that start with direction pattern but have more characters", () => {
    expect(hasIndividualDirections(["pt-4-extra"], "p")).toBe(true);
    expect(hasIndividualDirections(["mt-2-extra"], "m")).toBe(true);
  });

  it("should handle different direction values", () => {
    expect(hasIndividualDirections(["pt-0"], "p")).toBe(true);
    expect(hasIndividualDirections(["pt-full"], "p")).toBe(true);
    expect(hasIndividualDirections(["pt-[10px]"], "p")).toBe(true);
  });

  it("should not match x and y directions", () => {
    expect(hasIndividualDirections(["px-4"], "p")).toBe(false);
    expect(hasIndividualDirections(["py-2"], "p")).toBe(false);
  });
});

