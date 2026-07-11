import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type {
  ArrowFunctionExpression,
  FunctionDeclaration,
  FunctionExpression,
  ObjectPattern,
  Param,
} from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { ensureRestParameter } from "./ensureRestParameter";

describe("ensureRestParameter", () => {
  it("should not add rest parameter when it already exists and return true", () => {
    const restElement = {
      type: "RestElement" as const,
      span: createSpan(0),
      rest: createSpan(0),
      argument: createIdentifier("restProps", 0),
      typeAnnotation: undefined,
    };

    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [restElement as unknown as (typeof pattern.properties)[0]],
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
          pat: pattern,
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

    const initialLength = pattern.properties.length;

    const result = ensureRestParameter(declaration, "restProps");

    expect(result).toBe(true);
    expect(pattern.properties).toHaveLength(initialLength);
  });

  it("should create new parameter with RestElement when no parameters exist and return true", () => {
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

    const result = ensureRestParameter(declaration, "restProps");

    expect(result).toBe(true);
    expect(declaration.params).toHaveLength(1);
    const param = declaration.params[0];
    expect(param.type).toBe("Parameter");
    if (param.pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const pattern = param.pat;
    expect(pattern.properties).toHaveLength(1);
    const property = pattern.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    if (restElement.argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(restElement.argument.value).toBe("restProps");
  });

  it("should initialize params array if it is null", () => {
    const declaration: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: createSpan(0),
      identifier: createIdentifier("TestComponent", 0),
      declare: false,
      params: null as unknown as Param[],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: createSpan(0),
        stmts: [],
      },
      generator: false,
      async: false,
    };

    ensureRestParameter(declaration, "restProps");

    expect(declaration.params).toBeDefined();
    expect(declaration.params).toHaveLength(1);
  });

  it("should add RestElement to existing ObjectPattern", () => {
    const pattern: ObjectPattern = {
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
          pat: pattern,
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

    ensureRestParameter(declaration, "restProps");

    expect(pattern.properties).toHaveLength(2);
    const lastProperty = pattern.properties[1];
    if (lastProperty.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = lastProperty;
    if (restElement.argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(restElement.argument.value).toBe("restProps");
  });

  it("should work with FunctionExpression", () => {
    const declaration: FunctionExpression = {
      type: "FunctionExpression",
      span: createSpan(0),
      identifier: createIdentifier("TestComponent", 0),
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

    ensureRestParameter(declaration, "restProps");

    expect(declaration.params).toHaveLength(1);
  });

  it("should work with ArrowFunctionExpression", () => {
    const declaration: ArrowFunctionExpression = {
      type: "ArrowFunctionExpression",
      span: createSpan(0),
      params: [],
      body: {
        type: "BlockStatement",
        span: createSpan(0),
        stmts: [],
      },
      async: false,
      generator: false,
    };

    ensureRestParameter(declaration, "restProps");

    expect(declaration.params).toHaveLength(1);
  });

  it("should use default propName when not provided", () => {
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

    ensureRestParameter(declaration);

    expect(declaration.params).toHaveLength(1);
    const param = declaration.params[0];
    if (param.pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const pattern = param.pat;
    const property = pattern.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    if (restElement.argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(restElement.argument.value).toBe("restProps");
  });

  it("should use custom propName when provided", () => {
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

    ensureRestParameter(declaration, "customRest");

    expect(declaration.params).toHaveLength(1);
    const param = declaration.params[0];
    if (param.pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const pattern = param.pat;
    const property = pattern.properties[0];
    if (property.type !== "RestElement") {
      throw new Error("Expected RestElement");
    }
    const restElement = property;
    if (restElement.argument.type !== "Identifier") {
      throw new Error("Expected Identifier");
    }
    expect(restElement.argument.value).toBe("customRest");
  });

  it("should return false when first parameter is not ObjectPattern", () => {
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

    const result = ensureRestParameter(declaration, "restProps");

    expect(result).toBe(false);
    expect(declaration.params.length).toBe(1);
  });

  it("should return true when adding RestElement to existing ObjectPattern", () => {
    const pattern: ObjectPattern = {
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
          pat: pattern,
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

    const result = ensureRestParameter(declaration, "restProps");

    expect(result).toBe(true);
  });
});
