import { describe, expect, it } from "vitest";
import { matchesBackgroundImage } from "./matchesBackgroundImage";

describe("matchesBackgroundImage", () => {
  it("should match bg-none", () => {
    expect(matchesBackgroundImage("bg-none")).toBe(true);
  });

  it("should match linear gradient classes", () => {
    expect(matchesBackgroundImage("bg-linear-to-r")).toBe(true);
    expect(matchesBackgroundImage("bg-linear-45")).toBe(true);
  });

  it("should match radial gradient classes", () => {
    expect(matchesBackgroundImage("bg-radial")).toBe(true);
    expect(matchesBackgroundImage("bg-radial-[at_50%_50%]")).toBe(true);
  });

  it("should match conic gradient classes", () => {
    expect(matchesBackgroundImage("bg-conic")).toBe(true);
    expect(matchesBackgroundImage("bg-conic-180")).toBe(true);
  });

  it("should match gradient classes", () => {
    expect(matchesBackgroundImage("bg-gradient-to-r")).toBe(true);
  });

  it("should match URL classes", () => {
    expect(matchesBackgroundImage("bg-[url('test.jpg')]")).toBe(true);
    expect(matchesBackgroundImage("bg-[url(\"test.jpg\")]")).toBe(true);
    expect(matchesBackgroundImage("bg-[url(test.jpg)]")).toBe(true);
    expect(matchesBackgroundImage("bg-[image:url('test.jpg')]")).toBe(true);
  });

  it("should not match color classes", () => {
    expect(matchesBackgroundImage("bg-red-500")).toBe(false);
    expect(matchesBackgroundImage("bg-[#fff]")).toBe(false);
  });
});

