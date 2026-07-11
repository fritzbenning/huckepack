import { describe, expect, it } from "vitest";
import { FONT_SIZE_TOKENS } from "../constants";
import { matchesFontSize } from "./matchesFontSize";

describe("matchesFontSize", () => {
  it("should match standard font size tokens", () => {
    for (const token of FONT_SIZE_TOKENS) {
      expect(matchesFontSize(`text-${token}`)).toBe(true);
    }
  });

  it("should match arbitrary font size values", () => {
    expect(matchesFontSize("text-[14px]")).toBe(true);
    expect(matchesFontSize("text-[1.5rem]")).toBe(true);
    expect(matchesFontSize("text-[2em]")).toBe(true);
  });

  it("should not match color classes", () => {
    expect(matchesFontSize("text-red-500")).toBe(false);
    expect(matchesFontSize("text-[#fff]")).toBe(false);
  });

  it("should not match align classes", () => {
    expect(matchesFontSize("text-left")).toBe(false);
    expect(matchesFontSize("text-center")).toBe(false);
  });
});
