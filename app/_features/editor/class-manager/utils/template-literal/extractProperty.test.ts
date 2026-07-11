import type { Expression, Identifier, MemberExpression } from "@swc/wasm-web";
import { describe, expect, it, vi } from "vitest";
import { extractProperty } from "./extractProperty";

vi.mock("@ast/type-check", () => ({
  isIdentifier: vi.fn((node: Expression): node is Identifier => {
    return (node as Identifier).type === "Identifier";
  }),
  isMemberExpression: vi.fn((node: Expression): node is MemberExpression => {
    return (node as MemberExpression).type === "MemberExpression";
  }),
}));

describe("extractProperty", () => {
  it("should extract property from Identifier", () => {
    const node: Identifier = {
      type: "Identifier",
      span: { start: 0, end: 5, ctxt: 0 },
      value: "width",
      optional: false,
    };
    const result = extractProperty(node);
    expect(result).toBe("width");
  });

  it("should extract property from simple MemberExpression", () => {
    const node: MemberExpression = {
      type: "MemberExpression",
      span: { start: 0, end: 10, ctxt: 0 },
      object: {
        type: "Identifier",
        span: { start: 0, end: 4, ctxt: 0 },
        value: "obj",
        optional: false,
      },
      property: {
        type: "Identifier",
        span: { start: 5, end: 10, ctxt: 0 },
        value: "prop",
        optional: false,
      },
    };
    const result = extractProperty(node);
    expect(result).toBe("obj.prop");
  });

  it("should extract property from nested MemberExpression", () => {
    const innerMember: MemberExpression = {
      type: "MemberExpression",
      span: { start: 0, end: 7, ctxt: 0 },
      object: {
        type: "Identifier",
        span: { start: 0, end: 3, ctxt: 0 },
        value: "obj",
        optional: false,
      },
      property: {
        type: "Identifier",
        span: { start: 4, end: 7, ctxt: 0 },
        value: "inner",
        optional: false,
      },
    };

    const node: MemberExpression = {
      type: "MemberExpression",
      span: { start: 0, end: 12, ctxt: 0 },
      object: innerMember,
      property: {
        type: "Identifier",
        span: { start: 8, end: 12, ctxt: 0 },
        value: "prop",
        optional: false,
      },
    };
    const result = extractProperty(node);
    expect(result).toBe("obj.inner.prop");
  });

  it("should return null for non-Identifier, non-MemberExpression", () => {
    const node = {
      type: "StringLiteral",
      span: { start: 0, end: 5, ctxt: 0 },
      value: "test",
      raw: '"test"',
    } as Expression;
    const result = extractProperty(node);
    expect(result).toBeNull();
  });

  it("should handle MemberExpression with non-Identifier property", () => {
    const node: MemberExpression = {
      type: "MemberExpression",
      span: { start: 0, end: 10, ctxt: 0 },
      object: {
        type: "Identifier",
        span: { start: 0, end: 4, ctxt: 0 },
        value: "obj",
        optional: false,
      },
      property: {
        type: "StringLiteral",
        span: { start: 5, end: 10, ctxt: 0 },
        value: "prop",
        raw: '"prop"',
      },
    };
    const result = extractProperty(node);
    expect(result).toBe("obj.?");
  });

  it("should return null when object extraction fails in MemberExpression", () => {
    const node: MemberExpression = {
      type: "MemberExpression",
      span: { start: 0, end: 10, ctxt: 0 },
      object: {
        type: "StringLiteral",
        span: { start: 0, end: 4, ctxt: 0 },
        value: "test",
        raw: '"test"',
      },
      property: {
        type: "Identifier",
        span: { start: 5, end: 10, ctxt: 0 },
        value: "prop",
        optional: false,
      },
    };
    const result = extractProperty(node);
    expect(result).toBeNull();
  });
});

