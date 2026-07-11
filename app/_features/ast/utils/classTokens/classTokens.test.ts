
import { describe, it, expect } from "vitest";
import { addClassToken } from "./addClassToken";
import { joinClassTokens } from "./joinClassTokens";
import { removeClassToken } from "./removeClassToken";
import { replaceClassToken } from "./replaceClassToken";
import { splitClassTokens } from "./splitClassTokens";
import { updateClassTokens } from "./updateClassTokens";

describe("classTokens utils", () => {
  describe("splitClassTokens", () => {
    it("should split class tokens by whitespace", () => {
      expect(splitClassTokens("foo bar baz")).toEqual(["foo", "bar", "baz"]);
    });

    it("should handle multiple spaces", () => {
      expect(splitClassTokens("foo   bar  baz")).toEqual(["foo", "bar", "baz"]);
    });

    it("should handle leading/trailing spaces", () => {
      expect(splitClassTokens("  foo bar  ")).toEqual(["foo", "bar"]);
    });

    it("should return empty array for empty string", () => {
      expect(splitClassTokens("")).toEqual([]);
      expect(splitClassTokens("   ")).toEqual([]);
    });
  });

  describe("joinClassTokens", () => {
    it("should join tokens with space", () => {
      expect(joinClassTokens(["foo", "bar"])).toBe("foo bar");
    });
    
    it("should trim result", () => {
      // Though join won't add leading/trailing spaces if inputs are clean,
      // the implementation calls .trim() at the end.
      expect(joinClassTokens(["foo", "bar"])).toBe("foo bar");
    });
  });

  describe("addClassToken", () => {
    it("should add a new token", () => {
      expect(addClassToken("foo", "bar")).toBe("foo bar");
    });

    it("should not add duplicate token", () => {
      expect(addClassToken("foo bar", "bar")).toBe("foo bar");
    });

    it("should handle empty existing string", () => {
      expect(addClassToken("", "foo")).toBe("foo");
    });
  });

  describe("removeClassToken", () => {
    it("should remove existing token", () => {
      expect(removeClassToken("foo bar baz", "bar")).toBe("foo baz");
    });

    it("should do nothing if token not present", () => {
      expect(removeClassToken("foo baz", "bar")).toBe("foo baz");
    });

    it("should result in empty string if all removed", () => {
      expect(removeClassToken("foo", "foo")).toBe("");
    });
  });

  describe("replaceClassToken", () => {
    it("should replace existing token", () => {
      expect(replaceClassToken("foo bar baz", "bar", "qux")).toBe("foo qux baz");
    });

    it("should do nothing if old token not present", () => {
      expect(replaceClassToken("foo baz", "bar", "qux")).toBe("foo baz");
    });
  });

  describe("updateClassTokens", () => {
    it("should add and remove tokens", () => {
      const result = updateClassTokens("foo bar baz", ["qux"], ["bar"]);
      expect(result).toBe("foo baz qux");
    });

    it("should handle overlapping add/remove (remove takes precedence based on implementation logic? No, code removes first then adds)", () => {
      // Code: remove, then add.
      // If we remove "bar" and add "bar", it should appear.
      const result = updateClassTokens("foo bar", ["bar"], ["bar"]);
      expect(result).toBe("foo bar");
    });
    
    it("should add multiple tokens avoiding duplicates", () => {
       expect(updateClassTokens("foo", ["bar", "bar", "baz"], [])).toBe("foo bar baz");
    });
  });
});
