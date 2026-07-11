import type { Module, StringLiteral, TemplateLiteral } from "@swc/wasm-web";
import * as swcWalk from "swc-walk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getExistingClasses } from "./getExistingClasses";

vi.mock("@ast/utils", () => ({
  splitClassTokens: vi.fn((value: string) => value.split(" ").filter(Boolean)),
}));

type Visitor = {
  StringLiteral?: (node: StringLiteral) => void;
  TemplateLiteral?: (node: TemplateLiteral) => void;
};

vi.mock("swc-walk", () => {
  return {
    simple: vi.fn((_ast: Module, visitor: Visitor) => {
      const mockStringLiteral: StringLiteral = {
        type: "StringLiteral",
        span: { start: 10, end: 20, ctxt: 0 },
        value: "class1 class2 class3",
        raw: '"class1 class2 class3"',
      };

      const mockTemplateLiteral: TemplateLiteral = {
        type: "TemplateLiteral",
        span: { start: 30, end: 50, ctxt: 0 },
        expressions: [],
        quasis: [
          {
            type: "TemplateElement",
            span: { start: 30, end: 40, ctxt: 0 },
            tail: false,
            cooked: "class1 class2",
            raw: "class1 class2",
          },
          {
            type: "TemplateElement",
            span: { start: 40, end: 50, ctxt: 0 },
            tail: true,
            cooked: " class3",
            raw: " class3",
          },
        ],
      };

      if (visitor.StringLiteral) {
        visitor.StringLiteral(mockStringLiteral);
      }
      if (visitor.TemplateLiteral) {
        (visitor.TemplateLiteral as (node: TemplateLiteral) => void)(mockTemplateLiteral);
      }
    }),
  };
});

describe("getExistingClasses", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should extract classes from StringLiteral at matching position", () => {
    const mockAST = {} as Module;
    const result = getExistingClasses(mockAST, 10);
    expect(result).toEqual(["class1", "class2", "class3"]);
  });

  it("should extract classes from TemplateLiteral at matching position", () => {
    const mockAST = {} as Module;
    const result = getExistingClasses(mockAST, 30);
    expect(result).toEqual(["class1", "class2", "class3"]);
  });

  it("should return empty array when no matching node found", () => {
    vi.mocked(swcWalk.simple).mockImplementationOnce((_ast, _visitor) => {});
    const mockAST = {} as Module;
    const result = getExistingClasses(mockAST, 999);
    expect(result).toEqual([]);
  });

  it("should handle TemplateLiteral with empty quasis", () => {
    vi.mocked(swcWalk.simple).mockImplementationOnce((_ast, visitor) => {
      const mockTemplateLiteral: TemplateLiteral = {
        type: "TemplateLiteral",
        span: { start: 30, end: 50, ctxt: 0 },
        expressions: [],
        quasis: [
          {
            type: "TemplateElement",
            span: { start: 30, end: 40, ctxt: 0 },
            tail: true,
            cooked: "",
            raw: "",
          },
        ],
      };
      if (visitor.TemplateLiteral) {
        (visitor.TemplateLiteral as (node: TemplateLiteral) => void)(mockTemplateLiteral);
      }
    });
    const mockAST = {} as Module;
    const result = getExistingClasses(mockAST, 30);
    expect(result).toEqual([]);
  });
});
