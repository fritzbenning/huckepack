import { isStringLiteral } from "@ast/type-check";
import type { Identifier, JSXAttribute, JSXOpeningElement } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { getClassAttribute } from "./getClassAttribute";

describe("getClassAttribute", () => {
  it("should find className attribute", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 25, ctxt: 0 },
          name: { type: "Identifier", value: "className", span: { start: 5, end: 14, ctxt: 0 } } as Identifier,
          value: {
            type: "StringLiteral",
            value: "test-class",
            raw: '"test-class"',
            span: { start: 15, end: 25, ctxt: 0 },
          },
        } as JSXAttribute,
        {
          type: "JSXAttribute",
          span: { start: 26, end: 35, ctxt: 0 },
          name: { type: "Identifier", value: "id", span: { start: 26, end: 28, ctxt: 0 } } as Identifier,
          value: { type: "StringLiteral", value: "test-id", raw: '"test-id"', span: { start: 29, end: 35, ctxt: 0 } },
        } as JSXAttribute,
      ],
      selfClosing: false,
    };

    const result = getClassAttribute(mockOpening);

    expect(result).toBeDefined();
    expect(result?.type).toBe("JSXAttribute");
    expect((result?.name as Identifier).value).toBe("className");
    if (result?.value && isStringLiteral(result.value)) {
      expect(result.value.value).toBe("test-class");
    }
  });

  it("should return undefined when no className attribute exists", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 30, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 15, ctxt: 0 },
          name: { type: "Identifier", value: "id", span: { start: 5, end: 7, ctxt: 0 } } as Identifier,
          value: { type: "StringLiteral", value: "test-id", raw: '"test-id"', span: { start: 8, end: 15, ctxt: 0 } },
        } as JSXAttribute,
        {
          type: "JSXAttribute",
          span: { start: 16, end: 30, ctxt: 0 },
          name: { type: "Identifier", value: "data-test", span: { start: 16, end: 25, ctxt: 0 } } as Identifier,
          value: { type: "StringLiteral", value: "value", raw: '"value"', span: { start: 26, end: 30, ctxt: 0 } },
        } as JSXAttribute,
      ],
      selfClosing: false,
    };

    const result = getClassAttribute(mockOpening);

    expect(result).toBeUndefined();
  });

  it("should return first className attribute when multiple exist", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 60, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 25, ctxt: 0 },
          name: { type: "Identifier", value: "className", span: { start: 5, end: 14, ctxt: 0 } } as Identifier,
          value: {
            type: "StringLiteral",
            value: "first-class",
            raw: '"first-class"',
            span: { start: 15, end: 25, ctxt: 0 },
          },
        } as JSXAttribute,
        {
          type: "JSXAttribute",
          span: { start: 26, end: 46, ctxt: 0 },
          name: { type: "Identifier", value: "className", span: { start: 26, end: 35, ctxt: 0 } } as Identifier,
          value: {
            type: "StringLiteral",
            value: "second-class",
            raw: '"second-class"',
            span: { start: 36, end: 46, ctxt: 0 },
          },
        } as JSXAttribute,
      ],
      selfClosing: false,
    };

    const result = getClassAttribute(mockOpening);

    expect(result).toBeDefined();
    if (result?.value && isStringLiteral(result.value)) {
      expect(result.value.value).toBe("first-class");
    }
  });

  it("should handle empty attributes array", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 10, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    const result = getClassAttribute(mockOpening);

    expect(result).toBeUndefined();
  });

  it("should handle case-sensitive className matching", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 30, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 5, end: 25, ctxt: 0 },
          name: { type: "Identifier", value: "classname", span: { start: 5, end: 14, ctxt: 0 } } as Identifier, // lowercase
          value: {
            type: "StringLiteral",
            value: "test-class",
            raw: '"test-class"',
            span: { start: 15, end: 25, ctxt: 0 },
          },
        } as JSXAttribute,
      ],
      selfClosing: false,
    };

    const result = getClassAttribute(mockOpening);

    expect(result).toBeUndefined(); // Should not match lowercase "classname"
  });
});
