import type { FunctionDeclaration, FunctionExpression, ObjectPatternProperty, Param } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { getRestParameterName } from "./getRestParameterName";

describe("getRestParameterName", () => {
  it("should return rest parameter name from function declaration", () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        ctxt: 1,
        optional: false,
      },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 23, end: 45, ctxt: 0 },
          decorators: [],
          pat: {
            type: "ObjectPattern",
            span: { start: 23, end: 45, ctxt: 0 },
            properties: [
              {
                type: "AssignmentPatternProperty",
                span: { start: 25, end: 29, ctxt: 0 },
                key: {
                  type: "Identifier",
                  value: "prop1",
                  span: { start: 25, end: 30, ctxt: 1 },
                  ctxt: 1,
                  optional: false,
                },
                value: undefined,
              },
              {
                type: "RestElement",
                span: { start: 32, end: 43, ctxt: 0 },
                rest: { start: 32, end: 35, ctxt: 0 },
                argument: {
                  type: "Identifier",
                  value: "restProps",
                  span: { start: 35, end: 44, ctxt: 1 },
                  optional: false,
                },
              },
            ],
            optional: false,
          },
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 46, end: 50, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
      typeParameters: undefined,
      returnType: undefined,
    };

    const result = getRestParameterName(mockDeclaration);

    expect(result).toBe("restProps");
  });

  it("should return rest parameter name from function expression", () => {
    const mockExpression: FunctionExpression = {
      type: "FunctionExpression",
      span: { start: 0, end: 40, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        ctxt: 1,
        optional: false,
      },
      params: [
        {
          type: "Parameter",
          span: { start: 23, end: 35, ctxt: 0 },
          decorators: [],
          pat: {
            type: "ObjectPattern",
            span: { start: 23, end: 35, ctxt: 0 },
            properties: [
              {
                type: "RestElement" as const,
                span: { start: 25, end: 33, ctxt: 0 },
                rest: { start: 25, end: 28, ctxt: 0 },
                argument: {
                  type: "Identifier" as const,
                  value: "props",
                  span: { start: 28, end: 33, ctxt: 1 },
                  ctxt: 1,
                  optional: false,
                },
              },
            ],
            optional: false,
          },
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 36, end: 40, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
      typeParameters: undefined,
      returnType: undefined,
    };

    const result = getRestParameterName(mockExpression);

    expect(result).toBe("props");
  });

  it("should return null when no parameters exist", () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 30, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        ctxt: 1,
        optional: false,
      },
      declare: false,
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 25, end: 30, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
      typeParameters: undefined,
      returnType: undefined,
    };

    const result = getRestParameterName(mockDeclaration);

    expect(result).toBeNull();
  });

  it("should return null when params is null", () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 30, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        ctxt: 1,
        optional: false,
      },
      declare: false,
      params: null as unknown as Param[],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 25, end: 30, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
      typeParameters: undefined,
      returnType: undefined,
    };

    const result = getRestParameterName(mockDeclaration);

    expect(result).toBeNull();
  });

  it("should return null when first parameter is not ObjectPattern", () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 40, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        ctxt: 1,
        optional: false,
      },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 23, end: 35, ctxt: 0 },
          decorators: [],
          pat: {
            type: "Identifier",
            value: "props",
            span: { start: 23, end: 28, ctxt: 1 },
            ctxt: 1,
            optional: false,
          },
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 36, end: 40, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
      typeParameters: undefined,
      returnType: undefined,
    };

    const result = getRestParameterName(mockDeclaration);

    expect(result).toBeNull();
  });

  it("should return null when ObjectPattern has no properties", () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 35, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        ctxt: 1,
        optional: false,
      },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 23, end: 25, ctxt: 0 },
          decorators: [],
          pat: {
            type: "ObjectPattern",
            span: { start: 23, end: 25, ctxt: 0 },
            properties: null as unknown as ObjectPatternProperty[],
            optional: false,
          },
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 26, end: 35, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
      typeParameters: undefined,
      returnType: undefined,
    };

    const result = getRestParameterName(mockDeclaration);

    expect(result).toBeNull();
  });

  it("should return null when no RestElement exists", () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 45, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        ctxt: 1,
        optional: false,
      },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 23, end: 40, ctxt: 0 },
          decorators: [],
          pat: {
            type: "ObjectPattern",
            span: { start: 23, end: 40, ctxt: 0 },
            properties: [
              {
                type: "AssignmentPatternProperty",
                span: { start: 25, end: 30, ctxt: 0 },
                key: {
                  type: "Identifier",
                  value: "prop1",
                  span: { start: 25, end: 30, ctxt: 1 },
                  ctxt: 1,
                  optional: false,
                },
                value: undefined,
              },
              {
                type: "AssignmentPatternProperty",
                span: { start: 32, end: 37, ctxt: 0 },
                key: {
                  type: "Identifier",
                  value: "prop2",
                  span: { start: 32, end: 37, ctxt: 1 },
                  ctxt: 1,
                  optional: false,
                },
                value: undefined,
              },
            ],
            optional: false,
          },
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 41, end: 45, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
      typeParameters: undefined,
      returnType: undefined,
    };

    const result = getRestParameterName(mockDeclaration);

    expect(result).toBeNull();
  });

  it("should return null when RestElement argument is not Identifier", () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 45, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        ctxt: 1,
        optional: false,
      },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 23, end: 40, ctxt: 0 },
          decorators: [],
          pat: {
            type: "ObjectPattern",
            span: { start: 23, end: 40, ctxt: 0 },
            properties: [
              {
                type: "RestElement" as const,
                span: { start: 25, end: 38, ctxt: 0 },
                rest: { start: 25, end: 28, ctxt: 0 },
                argument: {
                  type: "ObjectPattern" as const,
                  span: { start: 28, end: 38, ctxt: 0 },
                  properties: [],
                  optional: false,
                },
              },
            ],
            optional: false,
          },
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 41, end: 45, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
      typeParameters: undefined,
      returnType: undefined,
    };

    const result = getRestParameterName(mockDeclaration);

    expect(result).toBeNull();
  });

  it("should find RestElement when it's not the last property", () => {
    const mockDeclaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 0, end: 50, ctxt: 0 },
      identifier: {
        type: "Identifier",
        value: "TestComponent",
        span: { start: 9, end: 22, ctxt: 1 },
        ctxt: 1,
        optional: false,
      },
      declare: false,
      params: [
        {
          type: "Parameter",
          span: { start: 23, end: 45, ctxt: 0 },
          decorators: [],
          pat: {
            type: "ObjectPattern",
            span: { start: 23, end: 45, ctxt: 0 },
            properties: [
              {
                type: "AssignmentPatternProperty",
                span: { start: 25, end: 30, ctxt: 0 },
                key: {
                  type: "Identifier",
                  value: "prop1",
                  span: { start: 25, end: 30, ctxt: 1 },
                  ctxt: 1,
                  optional: false,
                },
                value: undefined,
              },
              {
                type: "RestElement",
                span: { start: 32, end: 43, ctxt: 0 },
                rest: { start: 32, end: 35, ctxt: 0 },
                argument: {
                  type: "Identifier",
                  value: "restProps",
                  span: { start: 35, end: 44, ctxt: 1 },
                  optional: false,
                },
              },
              {
                type: "AssignmentPatternProperty",
                span: { start: 45, end: 50, ctxt: 0 },
                key: {
                  type: "Identifier",
                  value: "prop2",
                  span: { start: 45, end: 50, ctxt: 1 },
                  ctxt: 1,
                  optional: false,
                },
                value: undefined,
              },
            ],
            optional: false,
          },
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 46, end: 50, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
      typeParameters: undefined,
      returnType: undefined,
    };

    const result = getRestParameterName(mockDeclaration);

    expect(result).toBe("restProps");
  });
});
