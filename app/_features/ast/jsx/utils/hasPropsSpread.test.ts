import type { Identifier, JSXAttribute, JSXAttributeOrSpread, JSXOpeningElement } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { hasPropsSpread } from "./hasPropsSpread";

describe("hasPropsSpread", () => {
  it("should return false when no attributes exist", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 20, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [],
      selfClosing: false,
    };

    const result = hasPropsSpread(mockOpening);
    expect(result).toBe(false);
  });

  it("should return false when only regular JSX attributes exist", () => {
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

    const result = hasPropsSpread(mockOpening);
    expect(result).toBe(false);
  });

  it("should return true when props spread exists", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "SpreadElement",
          span: { start: 5, end: 15, ctxt: 0 },
          spread: { start: 5, end: 8 },
          arguments: {
            type: "Identifier",
            value: "props",
            span: { start: 8, end: 13, ctxt: 0 },
            ctxt: 0,
            optional: false,
          },
        } as unknown as JSXAttributeOrSpread,
      ],
      selfClosing: false,
    };

    const result = hasPropsSpread(mockOpening);
    expect(result).toBe(true);
  });

  it("should return true when rest spread exists", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "Component", span: { start: 1, end: 10, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "SpreadElement",
          span: { start: 11, end: 20, ctxt: 0 },
          spread: { start: 11, end: 14 },
          arguments: {
            type: "Identifier",
            value: "rest",
            span: { start: 14, end: 18, ctxt: 0 },
            ctxt: 0,
            optional: false,
          },
        } as unknown as JSXAttributeOrSpread,
      ],
      selfClosing: false,
    };

    const result = hasPropsSpread(mockOpening);
    expect(result).toBe(true);
  });

  it("should return true when restProps spread exists", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "Button", span: { start: 1, end: 7, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "SpreadElement",
          span: { start: 8, end: 22, ctxt: 0 },
          spread: { start: 8, end: 11 },
          arguments: {
            type: "Identifier",
            value: "restProps",
            span: { start: 11, end: 20, ctxt: 0 },
            ctxt: 0,
            optional: false,
          },
        } as unknown as JSXAttributeOrSpread,
      ],
      selfClosing: false,
    };

    const result = hasPropsSpread(mockOpening);
    expect(result).toBe(true);
  });

  it("should return true when otherProps spread exists", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "Input", span: { start: 1, end: 6, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "SpreadElement",
          span: { start: 7, end: 22, ctxt: 0 },
          spread: { start: 7, end: 10 },
          arguments: {
            type: "Identifier",
            value: "otherProps",
            span: { start: 10, end: 20, ctxt: 0 },
            ctxt: 0,
            optional: false,
          },
        } as unknown as JSXAttributeOrSpread,
      ],
      selfClosing: false,
    };

    const result = hasPropsSpread(mockOpening);
    expect(result).toBe(true);
  });

  it("should return false when spread exists but is not props-related", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "SpreadElement",
          span: { start: 5, end: 18, ctxt: 0 },
          spread: { start: 5, end: 8 },
          arguments: {
            type: "Identifier",
            value: "someObject",
            span: { start: 8, end: 18, ctxt: 0 },
            ctxt: 0,
            optional: false,
          },
        } as unknown as JSXAttributeOrSpread,
      ],
      selfClosing: false,
    };

    const result = hasPropsSpread(mockOpening);
    expect(result).toBe(false);
  });

  it("should return true when mixed with regular attributes and props spread exists", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 80, ctxt: 0 },
      name: { type: "Identifier", value: "Component", span: { start: 1, end: 10, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "JSXAttribute",
          span: { start: 11, end: 31, ctxt: 0 },
          name: { type: "Identifier", value: "className", span: { start: 11, end: 20, ctxt: 0 } } as Identifier,
          value: {
            type: "StringLiteral",
            value: "test-class",
            raw: '"test-class"',
            span: { start: 21, end: 31, ctxt: 0 },
          },
        } as JSXAttribute,
        {
          type: "SpreadElement",
          span: { start: 32, end: 42, ctxt: 0 },
          spread: { start: 32, end: 35 },
          arguments: {
            type: "Identifier",
            value: "props",
            span: { start: 35, end: 40, ctxt: 0 },
            ctxt: 0,
            optional: false,
          },
        } as unknown as JSXAttributeOrSpread,
        {
          type: "JSXAttribute",
          span: { start: 43, end: 52, ctxt: 0 },
          name: { type: "Identifier", value: "id", span: { start: 43, end: 45, ctxt: 0 } } as Identifier,
          value: { type: "StringLiteral", value: "test-id", raw: '"test-id"', span: { start: 46, end: 52, ctxt: 0 } },
        } as JSXAttribute,
      ],
      selfClosing: false,
    };

    const result = hasPropsSpread(mockOpening);
    expect(result).toBe(true);
  });

  it("should return false when spread element has no arguments", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "SpreadElement",
          span: { start: 5, end: 15, ctxt: 0 },
          spread: { start: 5, end: 8 },
          arguments: null,
        } as unknown as JSXAttributeOrSpread,
      ],
      selfClosing: false,
    };

    const result = hasPropsSpread(mockOpening);
    expect(result).toBe(false);
  });

  it("should return false when spread element arguments is not an Identifier", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "SpreadElement",
          span: { start: 5, end: 20, ctxt: 0 },
          spread: { start: 5, end: 8 },
          arguments: { type: "StringLiteral", value: "not-identifier", span: { start: 8, end: 20, ctxt: 0 } },
        } as unknown as JSXAttributeOrSpread,
      ],
      selfClosing: false,
    };

    const result = hasPropsSpread(mockOpening);
    expect(result).toBe(false);
  });

  it("should handle case insensitive prop names", () => {
    const mockOpening: JSXOpeningElement = {
      type: "JSXOpeningElement",
      span: { start: 0, end: 50, ctxt: 0 },
      name: { type: "Identifier", value: "div", span: { start: 1, end: 4, ctxt: 1 }, optional: false },
      attributes: [
        {
          type: "SpreadElement",
          span: { start: 5, end: 15, ctxt: 0 },
          spread: { start: 5, end: 8 },
          arguments: {
            type: "Identifier",
            value: "PROPS",
            span: { start: 8, end: 13, ctxt: 0 },
            ctxt: 0,
            optional: false,
          },
        } as unknown as JSXAttributeOrSpread,
      ],
      selfClosing: false,
    };

    const result = hasPropsSpread(mockOpening);
    expect(result).toBe(true);
  });
});
