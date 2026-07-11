import { describe, expect, it } from "vitest";
import { translateOperator } from "./translateOperator";

describe("translateOperator", () => {
  it("should translate ===", () => {
    expect(translateOperator("===")).toBe("equals");
  });

  it("should translate !==", () => {
    expect(translateOperator("!==")).toBe("not equals");
  });

  it("should translate ==", () => {
    expect(translateOperator("==")).toBe("equals");
  });

  it("should translate !=", () => {
    expect(translateOperator("!=")).toBe("not equals");
  });

  it("should translate <", () => {
    expect(translateOperator("<")).toBe("is less than");
  });

  it("should translate >", () => {
    expect(translateOperator(">")).toBe("isgreater than");
  });

  it("should translate <=", () => {
    expect(translateOperator("<=")).toBe("less than or equal");
  });

  it("should translate >=", () => {
    expect(translateOperator(">=")).toBe("greater than or equal");
  });

  it("should return empty string for null", () => {
    expect(translateOperator(null)).toBe("");
  });

  it("should return empty string for undefined", () => {
    expect(translateOperator(undefined)).toBe("");
  });

  it("should return original operator for unknown operators", () => {
    expect(translateOperator("**")).toBe("**");
  });

  it("should return original operator for empty string", () => {
    expect(translateOperator("")).toBe("");
  });
});

