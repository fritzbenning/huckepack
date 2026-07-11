import type { TemplateLiteral } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { processTemplateLiteral } from "./processTemplateLiteral";

vi.mock("@ast/string-literal/format", () => ({
  splitStringLiteral: vi.fn((value: string) => value.split(" ").filter(Boolean)),
}));

vi.mock("./processExpression", () => ({
  processExpression: vi.fn(() => ({
    kind: "expression",
    expressionType: "conditional",
    test: {
      value: "isActive",
      property: "isActive",
      operator: null,
      testValue: null,
      span: { start: 20, end: 30, ctxt: 0 },
    },
    consequent: {
      classes: ["class1"],
      raw: "class1",
      span: { start: 30, end: 40, ctxt: 0 },
    },
    alternate: {
      classes: ["class2"],
      raw: "class2",
      span: { start: 40, end: 50, ctxt: 0 },
    },
    span: { start: 20, end: 50, ctxt: 0 },
  })),
}));

describe("processTemplateLiteral", () => {
  it("should process TemplateLiteral with quasis and expressions", () => {
    const node: TemplateLiteral = {
      type: "TemplateLiteral",
      span: { start: 0, end: 50, ctxt: 0 },
      expressions: [
        {
          type: "Identifier",
          span: { start: 20, end: 30, ctxt: 0 },
          value: "isActive",
          optional: false,
        },
      ],
      quasis: [
        {
          type: "TemplateElement",
          span: { start: 0, end: 10, ctxt: 0 },
          tail: false,
          cooked: "class1 ",
          raw: "class1 ",
        },
        {
          type: "TemplateElement",
          span: { start: 40, end: 50, ctxt: 0 },
          tail: true,
          cooked: " class2",
          raw: " class2",
        },
      ],
    };

    const result = processTemplateLiteral(node);

    expect(result.type).toBe("TemplateLiteral");
    expect(result.segments).toHaveLength(3);
    expect(result.segments[0].kind).toBe("quasi");
    expect(result.segments[1].kind).toBe("expression");
    expect(result.segments[2].kind).toBe("quasi");
    expect(result.classTokens).toContain("class1");
    expect(result.classTokens).toContain("class2");
  });

  it("should skip empty quasis", () => {
    const node: TemplateLiteral = {
      type: "TemplateLiteral",
      span: { start: 0, end: 30, ctxt: 0 },
      expressions: [],
      quasis: [
        {
          type: "TemplateElement",
          span: { start: 0, end: 10, ctxt: 0 },
          tail: false,
          cooked: "   ",
          raw: "   ",
        },
        {
          type: "TemplateElement",
          span: { start: 10, end: 20, ctxt: 0 },
          tail: true,
          cooked: "class1",
          raw: "class1",
        },
      ],
    };

    const result = processTemplateLiteral(node);

    expect(result.segments).toHaveLength(1);
    expect(result.segments[0].kind).toBe("quasi");
    expect(result.classTokens).toEqual(["class1"]);
  });

  it("should handle TemplateLiteral with only quasis", () => {
    const node: TemplateLiteral = {
      type: "TemplateLiteral",
      span: { start: 0, end: 20, ctxt: 0 },
      expressions: [],
      quasis: [
        {
          type: "TemplateElement",
          span: { start: 0, end: 20, ctxt: 0 },
          tail: true,
          cooked: "class1 class2",
          raw: "class1 class2",
        },
      ],
    };

    const result = processTemplateLiteral(node);

    expect(result.segments).toHaveLength(1);
    expect(result.classTokens).toEqual(["class1", "class2"]);
  });

  it("should use raw value when cooked is not available", () => {
    const node: TemplateLiteral = {
      type: "TemplateLiteral",
      span: { start: 0, end: 10, ctxt: 0 },
      expressions: [],
      quasis: [
        {
          type: "TemplateElement",
          span: { start: 0, end: 10, ctxt: 0 },
          tail: true,
          cooked: null,
          raw: "class1",
        },
      ],
    };

    const result = processTemplateLiteral(node);

    expect(result.segments[0].kind).toBe("quasi");
    expect(result.classTokens).toEqual(["class1"]);
  });
});
