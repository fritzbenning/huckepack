import { describe, expect, it, vi } from "vitest";
import { addClassToStringLiteral, createStringLiteralWithClass } from "./stringLiteral";

// Mock dependencies
vi.mock("@ast/utils", () => ({
  addClassToken: vi.fn((existing, added) => {
    if (!existing) return added;
    return `${existing} ${added}`;
  }),
}));

vi.mock("@ast/string-literal/create/createStringLiteral", () => ({
  createStringLiteral: vi.fn((value) => ({ type: "StringLiteral", value })),
}));

describe("stringLiteral utils", () => {
  describe("addClassToStringLiteral", () => {
    it("should add class to existing string", () => {
      const result = addClassToStringLiteral("btn", "primary");
      expect(result).toBe("btn primary");
    });

    it("should handle empty existing string", () => {
      const result = addClassToStringLiteral("", "btn");
      expect(result).toBe("btn");
    });
  });

  describe("createStringLiteralWithClass", () => {
    it("should create new StringLiteral node with added class", () => {
      const result = createStringLiteralWithClass("btn", "primary");
      expect(result.type).toBe("StringLiteral");
      expect(result.value).toBe("btn primary");
    });
  });
});
