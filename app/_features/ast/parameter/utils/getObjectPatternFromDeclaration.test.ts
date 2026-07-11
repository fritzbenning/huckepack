import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type { FunctionDeclaration, FunctionExpression, ObjectPattern } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { getObjectPatternFromDeclaration } from "./getObjectPatternFromDeclaration";

describe("getObjectPatternFromDeclaration", () => {
  it("should return ObjectPattern from FunctionDeclaration with pat property", () => {
    const mockObjectPattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [],
      optional: false,
    };

    const declaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: createSpan(0),
      identifier: createIdentifier("TestComponent", 0),
      declare: false,
      params: [
        {
          type: "Parameter",
          span: createSpan(0),
          decorators: [],
          pat: mockObjectPattern,
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: createSpan(0),
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const result = getObjectPatternFromDeclaration(declaration);

    expect(result).toBe(mockObjectPattern);
  });

  it("should return ObjectPattern from FunctionExpression with pat property", () => {
    const mockObjectPattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [],
      optional: false,
    };

    const declaration: FunctionExpression = {
      type: "FunctionExpression",
      span: createSpan(0),
      identifier: createIdentifier("TestComponent", 0),
      params: [
        {
          type: "Parameter",
          span: createSpan(0),
          decorators: [],
          pat: mockObjectPattern,
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: createSpan(0),
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const result = getObjectPatternFromDeclaration(declaration);

    expect(result).toBe(mockObjectPattern);
  });

  it("should return ObjectPattern when param itself is ObjectPattern", () => {
    const mockObjectPattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [],
      optional: false,
    };

    const declaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: createSpan(0),
      identifier: createIdentifier("TestComponent", 0),
      declare: false,
      params: [mockObjectPattern as unknown as (typeof declaration.params)[0]],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: createSpan(0),
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const result = getObjectPatternFromDeclaration(declaration);

    expect(result).toBe(mockObjectPattern);
  });

  it("should return undefined when declaration is undefined", () => {
    const result = getObjectPatternFromDeclaration(undefined);

    expect(result).toBeUndefined();
  });

  it("should return undefined when params is empty", () => {
    const declaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: createSpan(0),
      identifier: createIdentifier("TestComponent", 0),
      declare: false,
      params: [],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: createSpan(0),
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const result = getObjectPatternFromDeclaration(declaration);

    expect(result).toBeUndefined();
  });

  it("should return undefined when params is null", () => {
    const declaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: createSpan(0),
      identifier: createIdentifier("TestComponent", 0),
      declare: false,
      params: null as unknown as (typeof declaration.params)[],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: createSpan(0),
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const result = getObjectPatternFromDeclaration(declaration);

    expect(result).toBeUndefined();
  });

  it("should return undefined when first param is not ObjectPattern", () => {
    const declaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: createSpan(0),
      identifier: createIdentifier("TestComponent", 0),
      declare: false,
      params: [
        {
          type: "Parameter",
          span: createSpan(0),
          decorators: [],
          pat: {
            type: "Identifier",
            span: createSpan(0),
            value: "props",
            optional: false,
          },
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: createSpan(0),
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const result = getObjectPatternFromDeclaration(declaration);

    expect(result).toBeUndefined();
  });

  it("should return undefined when first param is undefined", () => {
    const declaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: createSpan(0),
      identifier: createIdentifier("TestComponent", 0),
      declare: false,
      params: [undefined as unknown as (typeof declaration.params)[0]],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: createSpan(0),
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const result = getObjectPatternFromDeclaration(declaration);

    expect(result).toBeUndefined();
  });

  it("should return ObjectPattern with properties", () => {
    const mockObjectPattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [
        {
          type: "AssignmentPatternProperty",
          span: createSpan(0),
          key: createIdentifier("prop1", 0),
          value: undefined,
        },
      ],
      optional: false,
    };

    const declaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: createSpan(0),
      identifier: createIdentifier("TestComponent", 0),
      declare: false,
      params: [
        {
          type: "Parameter",
          span: createSpan(0),
          decorators: [],
          pat: mockObjectPattern,
        },
      ],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: createSpan(0),
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const result = getObjectPatternFromDeclaration(declaration);

    expect(result).toBe(mockObjectPattern);
    expect(result?.properties).toHaveLength(1);
  });
});

