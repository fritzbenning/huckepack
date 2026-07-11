import { isIdentifier } from "@ast/type-check";
import type { Module } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { findJSXElementBySpan } from "./findJSXElementBySpan";

describe("findJSXElementBySpan", () => {
  it("should find JSX element by exact span start", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 50, ctxt: 0 },
          expression: {
            type: "JSXElement",
            span: { start: 10, end: 40, ctxt: 0 },
            opening: {
              type: "JSXOpeningElement",
              span: { start: 10, end: 15, ctxt: 0 },
              name: { type: "Identifier", value: "div", span: { start: 11, end: 14, ctxt: 1 }, optional: false },
              attributes: [],
              selfClosing: false,
            },
            closing: {
              type: "JSXClosingElement",
              span: { start: 35, end: 40, ctxt: 0 },
              name: { type: "Identifier", value: "div", span: { start: 37, end: 40, ctxt: 1 }, optional: false },
            },
            children: [],
          },
        },
      ],
    } as unknown as Module;

    const result = findJSXElementBySpan(mockAST, 10);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("JSXElement");
    expect(result?.span.start).toBe(10);
  });

  it("should return null when no element found with matching span", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 50, ctxt: 0 },
          expression: {
            type: "JSXElement",
            span: { start: 10, end: 40, ctxt: 0 },
            opening: {
              type: "JSXOpeningElement",
              span: { start: 10, end: 15, ctxt: 0 },
              name: { type: "Identifier", value: "div", span: { start: 11, end: 14, ctxt: 1 }, optional: false },
              attributes: [],
              selfClosing: false,
            },
            closing: {
              type: "JSXClosingElement",
              span: { start: 35, end: 40, ctxt: 0 },
              name: { type: "Identifier", value: "div", span: { start: 37, end: 40, ctxt: 1 }, optional: false },
            },
            children: [],
          },
        },
      ],
    } as unknown as Module;

    const result = findJSXElementBySpan(mockAST, 999);

    expect(result).toBeNull();
  });

  it("should find nested JSX element by span", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 80, ctxt: 0 },
          expression: {
            type: "JSXElement",
            span: { start: 5, end: 75, ctxt: 0 },
            opening: {
              type: "JSXOpeningElement",
              span: { start: 5, end: 10, ctxt: 0 },
              name: { type: "Identifier", value: "div", span: { start: 6, end: 9, ctxt: 1 }, optional: false },
              attributes: [],
              selfClosing: false,
            },
            closing: {
              type: "JSXClosingElement",
              span: { start: 70, end: 75, ctxt: 0 },
              name: { type: "Identifier", value: "div", span: { start: 72, end: 75, ctxt: 1 }, optional: false },
            },
            children: [
              {
                type: "JSXElement",
                span: { start: 20, end: 60, ctxt: 0 },
                opening: {
                  type: "JSXOpeningElement",
                  span: { start: 20, end: 25, ctxt: 0 },
                  name: { type: "Identifier", value: "span", span: { start: 21, end: 25, ctxt: 1 }, optional: false },
                  attributes: [],
                  selfClosing: false,
                },
                closing: {
                  type: "JSXClosingElement",
                  span: { start: 55, end: 60, ctxt: 0 },
                  name: { type: "Identifier", value: "span", span: { start: 57, end: 61, ctxt: 1 }, optional: false },
                },
                children: [],
              },
            ],
          },
        },
      ],
    } as unknown as Module;

    const result = findJSXElementBySpan(mockAST, 20);

    expect(result).not.toBeNull();
    expect(result?.type).toBe("JSXElement");
    if (result && isIdentifier(result.opening.name)) {
      expect(result.opening.name.value).toBe("span");
    }
  });

  it("should return first matching element when multiple elements have same span start", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 50, ctxt: 0 },
          expression: {
            type: "JSXElement",
            span: { start: 10, end: 30, ctxt: 0 },
            opening: {
              type: "JSXOpeningElement",
              span: { start: 10, end: 15, ctxt: 0 },
              name: { type: "Identifier", value: "div", span: { start: 11, end: 14, ctxt: 1 }, optional: false },
              attributes: [],
              selfClosing: false,
            },
            closing: {
              type: "JSXClosingElement",
              span: { start: 25, end: 30, ctxt: 0 },
              name: { type: "Identifier", value: "div", span: { start: 27, end: 30, ctxt: 1 }, optional: false },
            },
            children: [],
          },
        },
        {
          type: "ExpressionStatement",
          span: { start: 50, end: 80, ctxt: 0 },
          expression: {
            type: "JSXElement",
            span: { start: 10, end: 70, ctxt: 0 }, // Same start as first element
            opening: {
              type: "JSXOpeningElement",
              span: { start: 10, end: 16, ctxt: 0 },
              name: { type: "Identifier", value: "span", span: { start: 11, end: 15, ctxt: 1 }, optional: false },
              attributes: [],
              selfClosing: false,
            },
            closing: {
              type: "JSXClosingElement",
              span: { start: 65, end: 70, ctxt: 0 },
              name: { type: "Identifier", value: "span", span: { start: 67, end: 71, ctxt: 1 }, optional: false },
            },
            children: [],
          },
        },
      ],
    } as unknown as Module;

    const result = findJSXElementBySpan(mockAST, 10);

    expect(result).not.toBeNull();
    if (result && isIdentifier(result.opening.name)) {
      expect(result.opening.name.value).toBe("div"); // Should return first match
    }
  });

  it("should handle empty AST", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 0, ctxt: 0 },
      body: [],
    } as unknown as Module;

    const result = findJSXElementBySpan(mockAST, 10);

    expect(result).toBeNull();
  });
});
