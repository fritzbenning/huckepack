import type { CallExpression, FunctionExpression, Identifier, MemberExpression } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { extractFunctionFromForwardRef } from "./extractFunctionFromForwardRef";

describe("extractFunctionFromForwardRef", () => {
  it("should extract function from forwardRef call with Identifier", () => {
    const mockFunction: FunctionExpression = {
      type: "FunctionExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "Component",
        span: { start: 0, end: 9, ctxt: 1 },
        optional: false,
      },
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 10, end: 50, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const callExpr: CallExpression = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      callee: {
        type: "Identifier",
        value: "forwardRef",
        span: { start: 0, end: 9, ctxt: 1 },
        optional: false,
      } as Identifier,
      arguments: [
        {
          type: "Argument",
          span: { start: 10, end: 50, ctxt: 0 },
          expression: mockFunction,
        },
      ],
    };

    const result = extractFunctionFromForwardRef(callExpr);

    expect(result).toBe(mockFunction);
  });

  it("should extract function from React.forwardRef call", () => {
    const mockFunction: FunctionExpression = {
      type: "FunctionExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "Component",
        span: { start: 0, end: 9, ctxt: 1 },
        optional: false,
      },
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 10, end: 50, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const memberExpr: MemberExpression = {
      type: "MemberExpression",
      span: { start: 0, end: 20, ctxt: 0 },
      object: {
        type: "Identifier",
        value: "React",
        span: { start: 0, end: 5, ctxt: 1 },
        optional: false,
      } as Identifier,
      property: {
        type: "Identifier",
        value: "forwardRef",
        span: { start: 6, end: 15, ctxt: 1 },
        optional: false,
      } as Identifier,
    };

    const callExpr: CallExpression = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      callee: memberExpr,
      arguments: [
        {
          type: "Argument",
          span: { start: 16, end: 50, ctxt: 0 },
          expression: mockFunction,
        },
      ],
    };

    const result = extractFunctionFromForwardRef(callExpr);

    expect(result).toBe(mockFunction);
  });

  it("should return undefined when node is not CallExpression", () => {
    const result = extractFunctionFromForwardRef({
      type: "Identifier",
      value: "test",
      span: { start: 0, end: 4, ctxt: 0 },
      optional: false,
    });

    expect(result).toBeUndefined();
  });

  it("should return undefined when callee is not forwardRef", () => {
    const callExpr: CallExpression = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      callee: {
        type: "Identifier",
        value: "otherFunction",
        span: { start: 0, end: 13, ctxt: 1 },
        optional: false,
      } as Identifier,
      arguments: [],
    };

    const result = extractFunctionFromForwardRef(callExpr);

    expect(result).toBeUndefined();
  });

  it("should return undefined when React.forwardRef object is not React", () => {
    const memberExpr: MemberExpression = {
      type: "MemberExpression",
      span: { start: 0, end: 20, ctxt: 0 },
      object: {
        type: "Identifier",
        value: "Other",
        span: { start: 0, end: 5, ctxt: 1 },
        optional: false,
      } as Identifier,
      property: {
        type: "Identifier",
        value: "forwardRef",
        span: { start: 6, end: 15, ctxt: 1 },
        optional: false,
      } as Identifier,
    };

    const callExpr: CallExpression = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      callee: memberExpr,
      arguments: [],
    };

    const result = extractFunctionFromForwardRef(callExpr);

    expect(result).toBeUndefined();
  });

  it("should return undefined when React.forwardRef property is not forwardRef", () => {
    const memberExpr: MemberExpression = {
      type: "MemberExpression",
      span: { start: 0, end: 20, ctxt: 0 },
      object: {
        type: "Identifier",
        value: "React",
        span: { start: 0, end: 5, ctxt: 1 },
        optional: false,
      } as Identifier,
      property: {
        type: "Identifier",
        value: "memo",
        span: { start: 6, end: 10, ctxt: 1 },
        optional: false,
      } as Identifier,
    };

    const callExpr: CallExpression = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      callee: memberExpr,
      arguments: [],
    };

    const result = extractFunctionFromForwardRef(callExpr);

    expect(result).toBeUndefined();
  });

  it("should return undefined when arguments array is empty", () => {
    const callExpr: CallExpression = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      callee: {
        type: "Identifier",
        value: "forwardRef",
        span: { start: 0, end: 9, ctxt: 1 },
        optional: false,
      } as Identifier,
      arguments: [],
    };

    const result = extractFunctionFromForwardRef(callExpr);

    expect(result).toBeUndefined();
  });

  it("should return undefined when first argument has no expression", () => {
    const callExpr: CallExpression = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      callee: {
        type: "Identifier",
        value: "forwardRef",
        span: { start: 0, end: 9, ctxt: 1 },
        optional: false,
      } as Identifier,
      arguments: [
        {
          type: "Argument",
          span: { start: 10, end: 50, ctxt: 0 },
          expression: null as unknown as (typeof callExpr.arguments)[0]["expression"],
        },
      ],
    };

    const result = extractFunctionFromForwardRef(callExpr);

    expect(result).toBeUndefined();
  });

  it("should return undefined when expression is not FunctionExpression or ArrowFunctionExpression", () => {
    const callExpr: CallExpression = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      callee: {
        type: "Identifier",
        value: "forwardRef",
        span: { start: 0, end: 9, ctxt: 1 },
        optional: false,
      } as Identifier,
      arguments: [
        {
          type: "Argument",
          span: { start: 10, end: 50, ctxt: 0 },
          expression: {
            type: "Identifier",
            value: "notAFunction",
            span: { start: 10, end: 22, ctxt: 1 },
            optional: false,
          },
        },
      ],
    };

    const result = extractFunctionFromForwardRef(callExpr);

    expect(result).toBeUndefined();
  });

  it("should extract ArrowFunctionExpression from forwardRef", () => {
    const mockArrowFunction = {
      type: "ArrowFunctionExpression" as const,
      span: { start: 0, end: 50, ctxt: 0 },
      params: [],
      body: {
        type: "BlockStatement",
        span: { start: 10, end: 50, ctxt: 0 },
        stmts: [],
      },
      async: false,
      generator: false,
    };

    const callExpr: CallExpression = {
      type: "CallExpression",
      span: { start: 0, end: 50, ctxt: 0 },
      callee: {
        type: "Identifier",
        value: "forwardRef",
        span: { start: 0, end: 9, ctxt: 1 },
        optional: false,
      } as Identifier,
      arguments: [
        {
          type: "Argument",
          span: { start: 10, end: 50, ctxt: 0 },
          expression: mockArrowFunction,
        },
      ],
    };

    const result = extractFunctionFromForwardRef(callExpr);

    expect(result).toBe(mockArrowFunction);
  });
});

