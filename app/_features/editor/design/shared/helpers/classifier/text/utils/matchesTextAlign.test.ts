import { describe, expect, it } from "vitest";
import { matchesTextAlign } from "./matchesTextAlign";

describe("matchesTextAlign", () => {
  it("should match all text align classes", () => {
    expect(matchesTextAlign("text-left")).toBe(true);
    expect(matchesTextAlign("text-center")).toBe(true);
    expect(matchesTextAlign("text-right")).toBe(true);
    expect(matchesTextAlign("text-justify")).toBe(true);
    expect(matchesTextAlign("text-start")).toBe(true);
    expect(matchesTextAlign("text-end")).toBe(true);
  });

  it("should not match font size classes", () => {
    expect(matchesTextAlign("text-lg")).toBe(false);
    expect(matchesTextAlign("text-[14px]")).toBe(false);
  });

  it("should not match color classes", () => {
    expect(matchesTextAlign("text-red-500")).toBe(false);
  });

  it("should not match non-text classes", () => {
    expect(matchesTextAlign("bg-red-500")).toBe(false);
  });
});

