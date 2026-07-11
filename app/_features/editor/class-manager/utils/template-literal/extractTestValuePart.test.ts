import type { BooleanLiteral, Expression, Identifier, MemberExpression, NumericLiteral, StringLiteral } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { extractTestValuePart } from "./extractTestValuePart";

vi.mock("@ast/type-check", () => ({
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

describe("extractTestValuePart", () => {
  it("should extract value from Identifier", () => {
    const node: Identifier = {
      type: "Identifier",
      span: { start: 0, end: 5, ctxt: 0 },
      value: "testValue",
      optional: false,
    };
    const result = extractTestValuePart(node);
    expect(result).toBe("testValue");
  });

  it("should extract value from NumericLiteral", () => {
    const node: NumericLiteral = {
      type: "NumericLiteral",
      span: { start: 0, end: 3, ctxt: 0 },
      value: 42,
      raw: "42",
    };
    const result = extractTestValuePart(node);
    expect(result).toBe(42);
  });

  it("should extract value from BooleanLiteral", () => {
    const node: BooleanLiteral = {
      type: "BooleanLiteral",
      span: { start: 0, end: 4, ctxt: 0 },
      value: true,
    };
    const result = extractTestValuePart(node);
    expect(result).toBe(true);
  });

  it("should extract value from StringLiteral", () => {
    const node: StringLiteral = {
      type: "StringLiteral",
      span: { start: 0, end: 6, ctxt: 0 },
      value: "test",
      raw: '"test"',
    };
    const result = extractTestValuePart(node);
    expect(result).toBe("test");
  });

  it("should extract value from MemberExpression", () => {
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
    const result = extractTestValuePart(node);
    expect(result).toBe("obj.prop");
  });

  it("should return null for unknown expression type", () => {
    const node = {
      type: "CallExpression",
      span: { start: 0, end: 5, ctxt: 0 },
    } as Expression;
    const result = extractTestValuePart(node);
    expect(result).toBeNull();
  });
});

