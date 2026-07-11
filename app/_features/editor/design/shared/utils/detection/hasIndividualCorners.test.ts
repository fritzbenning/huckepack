import { describe, expect, it } from "vitest";
import { hasIndividualCorners } from "./hasIndividualCorners";

describe("hasIndividualCorners", () => {
  it("should return true when classTokens contains top-left corner class", () => {
    expect(hasIndividualCorners(["rounded-tl-sm"], "rounded")).toBe(true);
    expect(hasIndividualCorners(["border-tl-2"], "border")).toBe(true);
  });

  it("should return true when classTokens contains top-right corner class", () => {
    expect(hasIndividualCorners(["rounded-tr-sm"], "rounded")).toBe(true);
    expect(hasIndividualCorners(["border-tr-2"], "border")).toBe(true);
  });

  it("should return true when classTokens contains bottom-right corner class", () => {
    expect(hasIndividualCorners(["rounded-br-sm"], "rounded")).toBe(true);
    expect(hasIndividualCorners(["border-br-2"], "border")).toBe(true);
  });

  it("should return true when classTokens contains bottom-left corner class", () => {
    expect(hasIndividualCorners(["rounded-bl-sm"], "rounded")).toBe(true);
    expect(hasIndividualCorners(["border-bl-2"], "border")).toBe(true);
  });

  it("should return false when classTokens is null", () => {
    expect(hasIndividualCorners(null, "rounded")).toBe(false);
  });

  it("should return false when no corner classes present", () => {
    expect(hasIndividualCorners(["rounded-sm", "other-class"], "rounded")).toBe(false);
    expect(hasIndividualCorners(["border-2"], "border")).toBe(false);
  });

  it("should handle prefix with trailing dash", () => {
    expect(hasIndividualCorners(["rounded-tl-sm"], "rounded-")).toBe(true);
    expect(hasIndividualCorners(["border-tl-2"], "border-")).toBe(true);
  });

  it("should handle prefix without trailing dash", () => {
    expect(hasIndividualCorners(["rounded-tl-sm"], "rounded")).toBe(true);
    expect(hasIndividualCorners(["border-tl-2"], "border")).toBe(true);
  });

  it("should handle multiple corner classes", () => {
    expect(hasIndividualCorners(["rounded-tl-sm", "rounded-tr-md"], "rounded")).toBe(true);
    expect(hasIndividualCorners(["border-tl-2", "border-br-4"], "border")).toBe(true);
  });

  it("should return false for non-corner classes with same prefix", () => {
    expect(hasIndividualCorners(["rounded-sm"], "rounded")).toBe(false);
    expect(hasIndividualCorners(["border-2"], "border")).toBe(false);
  });

  it("should handle empty classTokens array", () => {
    expect(hasIndividualCorners([], "rounded")).toBe(false);
  });

  it("should handle classes that start with corner pattern but are not corners", () => {
    expect(hasIndividualCorners(["rounded-tl-sm-extra"], "rounded")).toBe(true);
    expect(hasIndividualCorners(["border-tl-2-extra"], "border")).toBe(true);
  });

  it("should handle different corner values", () => {
    expect(hasIndividualCorners(["rounded-tl-none"], "rounded")).toBe(true);
    expect(hasIndividualCorners(["rounded-tl-full"], "rounded")).toBe(true);
    expect(hasIndividualCorners(["rounded-tl-[10px]"], "rounded")).toBe(true);
  });
});

