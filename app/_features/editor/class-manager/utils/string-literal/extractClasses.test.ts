import type { Expression, StringLiteral } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { extractClasses } from "./extractClasses";

vi.mock("@ast/type-check", () => ({
  isStringLiteral: vi.fn((node: Expression): node is StringLiteral => {
    return (node as StringLiteral).type === "StringLiteral";
  }),
}));

vi.mock("@ast/string-literal/format", () => ({
  splitStringLiteral: vi.fn((value: string) => value.split(" ").filter(Boolean)),
}));

describe("extractClasses", () => {
  it("should extract classes from StringLiteral", () => {
    const node: StringLiteral = {
      type: "StringLiteral",
      span: { start: 0, end: 20, ctxt: 0 },
      value: "class1 class2 class3",
      raw: '"class1 class2 class3"',
    };
    const result = extractClasses(node);
    expect(result).toEqual(["class1", "class2", "class3"]);
  });

  it("should return empty array for non-StringLiteral", () => {
    const node = {
      type: "Identifier",
      span: { start: 0, end: 5, ctxt: 0 },
      value: "test",
    } as Expression;
    const result = extractClasses(node);
    expect(result).toEqual([]);
  });

  it("should handle empty string", () => {
    const node: StringLiteral = {
      type: "StringLiteral",
      span: { start: 0, end: 2, ctxt: 0 },
      value: "",
      raw: '""',
    };
    const result = extractClasses(node);
    expect(result).toEqual([]);
  });

  it("should handle string with only spaces", () => {
    const node: StringLiteral = {
      type: "StringLiteral",
      span: { start: 0, end: 5, ctxt: 0 },
      value: "   ",
      raw: '"   "',
    };
    const result = extractClasses(node);
    expect(result).toEqual([]);
  });
});
