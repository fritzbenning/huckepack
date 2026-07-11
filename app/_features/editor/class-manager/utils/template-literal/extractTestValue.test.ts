import type {
  BinaryExpression,
  BooleanLiteral,
  Expression,
  Identifier,
  MemberExpression,
  NumericLiteral,
  StringLiteral,
  UnaryExpression,
} from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { extractTestValue } from "./extractTestValue";

vi.mock("@ast/type-check", () => ({
  isUnaryExpression: vi.fn((node: Expression): node is UnaryExpression => {
    return (node as UnaryExpression).type === "UnaryExpression";
  }),
  isBinaryExpression: vi.fn((node: Expression): node is BinaryExpression => {
    return (node as BinaryExpression).type === "BinaryExpression";
  }),
  isIdentifier: vi.fn((node: Expression): node is Identifier => {
    return (node as Identifier).type === "Identifier";
  }),
  isNumericLiteral: vi.fn((node: Expression): node is NumericLiteral => {
    return (node as NumericLiteral).type === "NumericLiteral";
  }),
  isBooleanLiteral: vi.fn((node: Expression): node is BooleanLiteral => {
    return (node as BooleanLiteral).type === "BooleanLiteral";
  }),
  isStringLiteral: vi.fn((node: Expression): node is StringLiteral => {
    return (node as StringLiteral).type === "StringLiteral";
  }),
  isMemberExpression: vi.fn((node: Expression): node is MemberExpression => {
    return (node as MemberExpression).type === "MemberExpression";
  }),
}));

vi.mock("./extractProperty", () => ({
  extractProperty: vi.fn((node: Expression) => {
    if ((node as Identifier).type === "Identifier") {
      return (node as Identifier).value;
    }
    if ((node as MemberExpression).type === "MemberExpression") {
      return "obj.prop";
    }
    return null;
  }),
}));

vi.mock("./extractTestValuePart", () => ({
  extractTestValuePart: vi.fn((node: Expression) => {
    if ((node as NumericLiteral).type === "NumericLiteral") {
      return (node as NumericLiteral).value;
    }
    if ((node as StringLiteral).type === "StringLiteral") {
      return (node as StringLiteral).value;
    }
    if ((node as BooleanLiteral).type === "BooleanLiteral") {
      return (node as BooleanLiteral).value;
    }
    return null;
  }),
}));

describe("extractTestValue", () => {
  it("should extract test value from UnaryExpression with !", () => {
    const node: UnaryExpression = {
      type: "UnaryExpression",
      span: { start: 0, end: 5, ctxt: 0 },
      operator: "!",
      argument: {
        type: "Identifier",
        span: { start: 1, end: 5, ctxt: 0 },
        value: "prop",
        optional: false,
      },
    };
    const result = extractTestValue(node);
    expect(result).toEqual({
      value: "!prop",
      property: "prop",
      operator: "!",
      testValue: null,
    });
  });

  it("should extract test value from BinaryExpression", () => {
    const node: BinaryExpression = {
      type: "BinaryExpression",
      span: { start: 0, end: 15, ctxt: 0 },
      operator: "===",
      left: {
        type: "Identifier",
        span: { start: 0, end: 5, ctxt: 0 },
        value: "width",
        optional: false,
      },
      right: {
        type: "NumericLiteral",
        span: { start: 10, end: 12, ctxt: 0 },
        value: 100,
        raw: "100",
      },
    };
    const result = extractTestValue(node);
    expect(result).toEqual({
      value: "width === 100",
      property: "width",
      operator: "===",
      testValue: 100,
    });
  });

  it("should extract test value from Identifier", () => {
    const node: Identifier = {
      type: "Identifier",
      span: { start: 0, end: 5, ctxt: 0 },
      value: "isActive",
      optional: false,
    };
    const result = extractTestValue(node);
    expect(result).toEqual({
      value: "isActive",
      property: "isActive",
      operator: null,
      testValue: null,
    });
  });

  it("should extract test value from NumericLiteral", () => {
    const node: NumericLiteral = {
      type: "NumericLiteral",
      span: { start: 0, end: 3, ctxt: 0 },
      value: 42,
      raw: "42",
    };
    const result = extractTestValue(node);
    expect(result).toEqual({
      value: "42",
      property: null,
      operator: null,
      testValue: 42,
    });
  });

  it("should extract test value from BooleanLiteral", () => {
    const node: BooleanLiteral = {
      type: "BooleanLiteral",
      span: { start: 0, end: 4, ctxt: 0 },
      value: true,
    };
    const result = extractTestValue(node);
    expect(result).toEqual({
      value: "true",
      property: null,
      operator: null,
      testValue: true,
    });
  });

  it("should extract test value from StringLiteral", () => {
    const node: StringLiteral = {
      type: "StringLiteral",
      span: { start: 0, end: 6, ctxt: 0 },
      value: "test",
      raw: '"test"',
    };
    const result = extractTestValue(node);
    expect(result).toEqual({
      value: "test",
      property: null,
      operator: null,
      testValue: "test",
    });
  });

  it("should extract test value from MemberExpression", () => {
    const node: MemberExpression = {
      type: "MemberExpression",
      span: { start: 0, end: 10, ctxt: 0 },
      object: {
        type: "Identifier",
        span: { start: 0, end: 3, ctxt: 0 },
        value: "obj",
        optional: false,
      },
      property: {
        type: "Identifier",
        span: { start: 4, end: 7, ctxt: 0 },
        value: "prop",
        optional: false,
      },
    };
    const result = extractTestValue(node);
    expect(result).toEqual({
      value: "obj.prop",
      property: "obj.prop",
      operator: null,
      testValue: null,
    });
  });

  it("should return unknown for unsupported expression type", () => {
    const node = {
      type: "CallExpression",
      span: { start: 0, end: 5, ctxt: 0 },
    } as Expression;
    const result = extractTestValue(node);
    expect(result).toEqual({
      value: "unknown",
      property: null,
      operator: null,
      testValue: null,
    });
  });
});

