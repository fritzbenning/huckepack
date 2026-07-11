import type { Module } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { findTemplateLiteralAtPosition } from "./findTemplateLiteralAtPosition";

describe("findTemplateLiteralAtPosition", () => {
  it("should return true when template literal found at exact position", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 50, ctxt: 0 },
          expression: {
            type: "TemplateLiteral",
            span: { start: 10, end: 40, ctxt: 0 },
            expressions: [],
            quasis: [
              {
                type: "TemplateElement",
                span: { start: 11, end: 39, ctxt: 0 },
                tail: true,
                cooked: "Hello World",
                raw: "Hello World",
              },
            ],
          },
        },
      ],
    } as unknown as Module;

    const result = findTemplateLiteralAtPosition(mockAST, 10);
    expect(result).toBe(true);
  });

  it("should return false when no template literal found at position", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 50, ctxt: 0 },
          expression: {
            type: "TemplateLiteral",
            span: { start: 10, end: 40, ctxt: 0 },
            expressions: [],
            quasis: [
              {
                type: "TemplateElement",
                span: { start: 11, end: 39, ctxt: 0 },
                tail: true,
                cooked: "Hello World",
                raw: "Hello World",
              },
            ],
          },
        },
      ],
    } as unknown as Module;

    const result = findTemplateLiteralAtPosition(mockAST, 999);
    expect(result).toBe(false);
  });

  it("should return false when AST has no template literals", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 50, ctxt: 0 },
          expression: {
            type: "StringLiteral",
            span: { start: 10, end: 40, ctxt: 0 },
            value: "Hello World",
            raw: '"Hello World"',
          },
        },
      ],
    } as unknown as Module;

    const result = findTemplateLiteralAtPosition(mockAST, 10);
    expect(result).toBe(false);
  });

  it("should return true for first matching template literal when multiple exist", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 50, ctxt: 0 },
          expression: {
            type: "TemplateLiteral",
            span: { start: 10, end: 30, ctxt: 0 },
            expressions: [],
            quasis: [
              {
                type: "TemplateElement",
                span: { start: 11, end: 29, ctxt: 0 },
                tail: true,
                cooked: "First",
                raw: "First",
              },
            ],
          },
        },
        {
          type: "ExpressionStatement",
          span: { start: 60, end: 100, ctxt: 0 },
          expression: {
            type: "TemplateLiteral",
            span: { start: 10, end: 90, ctxt: 0 }, // Same start position
            expressions: [],
            quasis: [
              {
                type: "TemplateElement",
                span: { start: 71, end: 89, ctxt: 0 },
                tail: true,
                cooked: "Second",
                raw: "Second",
              },
            ],
          },
        },
      ],
    } as unknown as Module;

    const result = findTemplateLiteralAtPosition(mockAST, 10);
    expect(result).toBe(true);
  });

  it("should handle nested template literals", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 100, ctxt: 0 },
          expression: {
            type: "CallExpression",
            span: { start: 5, end: 95, ctxt: 0 },
            callee: {
              type: "Identifier",
              span: { start: 5, end: 8, ctxt: 0 },
              value: "log",
              optional: false,
            },
            arguments: [
              {
                spread: null,
                expression: {
                  type: "TemplateLiteral",
                  span: { start: 20, end: 80, ctxt: 0 },
                  expressions: [],
                  quasis: [
                    {
                      type: "TemplateElement",
                      span: { start: 21, end: 79, ctxt: 0 },
                      tail: true,
                      cooked: "Nested template",
                      raw: "Nested template",
                    },
                  ],
                },
              },
            ],
            typeArguments: null,
          },
        },
      ],
    } as unknown as Module;

    const result = findTemplateLiteralAtPosition(mockAST, 20);
    expect(result).toBe(true);
  });

  it("should handle template literals with expressions", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 80, ctxt: 0 },
          expression: {
            type: "TemplateLiteral",
            span: { start: 15, end: 75, ctxt: 0 },
            expressions: [
              {
                type: "Identifier",
                span: { start: 25, end: 29, ctxt: 0 },
                value: "name",
                optional: false,
              },
            ],
            quasis: [
              {
                type: "TemplateElement",
                span: { start: 16, end: 23, ctxt: 0 },
                tail: false,
                cooked: "Hello ",
                raw: "Hello ",
              },
              {
                type: "TemplateElement",
                span: { start: 30, end: 74, ctxt: 0 },
                tail: true,
                cooked: "!",
                raw: "!",
              },
            ],
          },
        },
      ],
    } as unknown as Module;

    const result = findTemplateLiteralAtPosition(mockAST, 15);
    expect(result).toBe(true);
  });

  it("should return false for empty AST", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 0, ctxt: 0 },
      body: [],
    } as unknown as Module;

    const result = findTemplateLiteralAtPosition(mockAST, 10);
    expect(result).toBe(false);
  });

  it("should handle position at start of file", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 50, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 40, ctxt: 0 },
          expression: {
            type: "TemplateLiteral",
            span: { start: 0, end: 35, ctxt: 0 },
            expressions: [],
            quasis: [
              {
                type: "TemplateElement",
                span: { start: 1, end: 34, ctxt: 0 },
                tail: true,
                cooked: "Start of file",
                raw: "Start of file",
              },
            ],
          },
        },
      ],
    } as unknown as Module;

    const result = findTemplateLiteralAtPosition(mockAST, 0);
    expect(result).toBe(true);
  });

  it("should handle negative position", () => {
    const mockAST = {
      type: "Module",
      span: { start: 0, end: 50, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 5, end: 40, ctxt: 0 },
          expression: {
            type: "TemplateLiteral",
            span: { start: 10, end: 35, ctxt: 0 },
            expressions: [],
            quasis: [
              {
                type: "TemplateElement",
                span: { start: 11, end: 34, ctxt: 0 },
                tail: true,
                cooked: "Template",
                raw: "Template",
              },
            ],
          },
        },
      ],
    } as unknown as Module;

    const result = findTemplateLiteralAtPosition(mockAST, -5);
    expect(result).toBe(false);
  });
});
