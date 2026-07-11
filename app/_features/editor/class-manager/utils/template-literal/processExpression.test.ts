import type {
  BinaryExpression,
  ConditionalExpression,
  Expression,
  Identifier,
  NumericLiteral,
  StringLiteral,
} from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { processExpression } from "./processExpression";

vi.mock("@ast/core/get/getSpan", () => ({
  getSpan: vi.fn((node: Expression) => ({ start: 0, end: 10, ctxt: 0 })),
}));

vi.mock("@ast/string-literal/get/getStringLiteralValue", () => ({
  getStringLiteralValue: vi.fn((node: Expression) => {
    if ((node as StringLiteral).type === "StringLiteral") {
      return (node as StringLiteral).value;
    }
    return "";
  }),
}));

vi.mock("@ast/type-check", () => ({
  isBinaryExpression: vi.fn((node: Expression): node is BinaryExpression => {
    return (node as BinaryExpression).type === "BinaryExpression";
  }),
  isConditionalExpression: vi.fn((node: Expression): node is ConditionalExpression => {
    return (node as ConditionalExpression).type === "ConditionalExpression";
  }),
  isStringLiteral: vi.fn((node: Expression): node is StringLiteral => {
    return (node as StringLiteral).type === "StringLiteral";
  }),
}));

vi.mock("../string-literal/extractClasses", () => ({
  extractClasses: vi.fn((node: Expression) => {
    if ((node as StringLiteral).type === "StringLiteral") {
      return (node as StringLiteral).value.split(" ");
    }
    return [];
  }),
}));

vi.mock("./extractTestValue", () => ({
  extractTestValue: vi.fn((node: Expression) => {
    if ((node as Identifier).type === "Identifier") {
      return {
        value: (node as Identifier).value,
        property: (node as Identifier).value,
        operator: null,
        testValue: null,
      };
    }
    return {
      value: "unknown",
      property: null,
      operator: null,
      testValue: null,
    };
  }),
}));

describe("processExpression", () => {
  it("should process ConditionalExpression", () => {
    const node: ConditionalExpression = {
      type: "ConditionalExpression",
      span: { start: 0, end: 30, ctxt: 0 },
      test: {
        type: "Identifier",
        span: { start: 0, end: 5, ctxt: 0 },
        value: "isActive",
        optional: false,
      },
      consequent: {
        type: "StringLiteral",
        span: { start: 10, end: 20, ctxt: 0 },
        value: "class1 class2",
        raw: '"class1 class2"',
      },
      alternate: {
        type: "StringLiteral",
        span: { start: 22, end: 30, ctxt: 0 },
        value: "class3",
        raw: '"class3"',
      },
    };

    const result = processExpression(node);

    expect(result.kind).toBe("expression");
    expect(result.expressionType).toBe("conditional");
    expect(result.test.property).toBe("isActive");
    expect(result.consequent.classes).toEqual(["class1", "class2"]);
    expect(result.alternate.classes).toEqual(["class3"]);
  });

  it("should process BinaryExpression with &&", () => {
    const node: BinaryExpression = {
      type: "BinaryExpression",
      span: { start: 0, end: 20, ctxt: 0 },
      operator: "&&",
      left: {
        type: "Identifier",
        span: { start: 0, end: 5, ctxt: 0 },
        value: "isActive",
        optional: false,
      },
      right: {
        type: "StringLiteral",
        span: { start: 10, end: 20, ctxt: 0 },
        value: "class1 class2",
        raw: '"class1 class2"',
      },
    };

    const result = processExpression(node);

    expect(result.kind).toBe("expression");
    expect(result.expressionType).toBe("logical-and");
    expect(result.operator).toBe("&&");
    expect(result.consequent.classes).toEqual(["class1", "class2"]);
    expect(result.alternate).toBeNull();
  });

  it("should process BinaryExpression with ||", () => {
    const node: BinaryExpression = {
      type: "BinaryExpression",
      span: { start: 0, end: 20, ctxt: 0 },
      operator: "||",
      left: {
        type: "Identifier",
        span: { start: 0, end: 5, ctxt: 0 },
        value: "isActive",
        optional: false,
      },
      right: {
        type: "StringLiteral",
        span: { start: 10, end: 20, ctxt: 0 },
        value: "class1",
        raw: '"class1"',
      },
    };

    const result = processExpression(node);

    expect(result.kind).toBe("expression");
    expect(result.expressionType).toBe("logical-or");
    expect(result.operator).toBe("||");
  });

  it("should return unknown for unsupported expression", () => {
    const node = {
      type: "CallExpression",
      span: { start: 0, end: 10, ctxt: 0 },
    } as Expression;

    const result = processExpression(node);

    expect(result.kind).toBe("expression");
    expect(result.expressionType).toBe("unknown");
  });
});

