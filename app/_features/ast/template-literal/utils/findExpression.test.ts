import type { Expression, TemplateLiteral } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { findConditionalExpressionBySpanStart, findExpressionBySpanStart } from "./findExpression";

// Mock dependencies
vi.mock("@ast/core/get/getExpressionSpan", () => ({
  getExpressionSpan: vi.fn((node: Expression) => {
    // Return span from node if present
    return (
      (node as unknown as { span: { start: number; end: number; ctxt: number } }).span || { start: 0, end: 0, ctxt: 0 }
    );
  }),
}));

describe("findExpression", () => {
  describe("findExpressionBySpanStart", () => {
    it("should find expression matching strict start span", () => {
      const expression: Expression = {
        type: "Identifier",
        span: { start: 10, end: 20, ctxt: 0 },
        value: "val",
        optional: false,
      } as Expression;

      const template: TemplateLiteral = {
        type: "TemplateLiteral",
        span: { start: 0, end: 100, ctxt: 0 },
        quasis: [],
        expressions: [expression],
      };

      const result = findExpressionBySpanStart(template, 10);
      expect(result).not.toBeNull();
      expect(result?.expression).toBe(expression);
      expect(result?.index).toBe(0);
      expect(result?.span.start).toBe(10);
    });

    it("should return null if no expression matches span start", () => {
      const expression: Expression = {
        type: "Identifier",
        span: { start: 10, end: 20, ctxt: 0 },
        value: "val",
        optional: false,
      } as Expression;

      const template: TemplateLiteral = {
        type: "TemplateLiteral",
        span: { start: 0, end: 100, ctxt: 0 },
        quasis: [],
        expressions: [expression],
      };

      const result = findExpressionBySpanStart(template, 99);
      expect(result).toBeNull();
    });
  });

  describe("findConditionalExpressionBySpanStart", () => {
    // This function logic seems identical to findExpressionBySpanStart in the source code provided.
    // It might be intended for specific use cases but currently behaves same.
    it("should find expression matching start span", () => {
      const expression: Expression = {
        type: "ConditionalExpression",
        span: { start: 50, end: 80, ctxt: 0 },
        test: { type: "Identifier", value: "x", span: { start: 50, end: 51, ctxt: 0 } },
        consequent: { type: "StringLiteral", value: "a", span: { start: 54, end: 56, ctxt: 0 } },
        alternate: { type: "StringLiteral", value: "b", span: { start: 59, end: 61, ctxt: 0 } },
      } as unknown as Expression;

      const template: TemplateLiteral = {
        type: "TemplateLiteral",
        span: { start: 0, end: 100, ctxt: 0 },
        quasis: [],
        expressions: [expression],
      };

      const result = findConditionalExpressionBySpanStart(template, 50);
      expect(result).not.toBeNull();
      expect(result?.expression).toBe(expression);
    });
  });
});
