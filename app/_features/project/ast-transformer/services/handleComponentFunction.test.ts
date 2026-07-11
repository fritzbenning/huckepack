import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type { ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, ObjectPattern } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { type ComponentFunction, handleComponentFunction } from "./handleComponentFunction";

describe("handleComponentFunction", () => {
  const createMockFunctionDeclaration = (spanStart: number = 0): FunctionDeclaration => ({
    type: "FunctionDeclaration",
    span: createSpan(spanStart),
    identifier: createIdentifier("TestComponent", spanStart),
    declare: false,
    params: [],
    decorators: [],
    body: {
      type: "BlockStatement",
      span: createSpan(spanStart),
      stmts: [],
    },
    generator: false,
    async: false,
  });

  const createMockFunctionExpression = (spanStart: number = 0): FunctionExpression => ({
    type: "FunctionExpression",
    span: createSpan(spanStart),
    identifier: undefined,
    params: [],
    decorators: [],
    body: {
      type: "BlockStatement",
      span: createSpan(spanStart),
      stmts: [],
    },
    generator: false,
    async: false,
  });

  const createMockArrowFunctionExpression = (spanStart: number = 0): ArrowFunctionExpression => ({
    type: "ArrowFunctionExpression",
    span: createSpan(spanStart),
    params: [],
    body: {
      type: "BlockStatement",
      span: createSpan(spanStart),
      stmts: [],
    },
    generator: false,
    async: false,
  });

  it("should add function to map when span matches", () => {
    const func = createMockFunctionDeclaration(100);
    const componentFunctionSpans = new Set<number>([func.span.start]);
    const componentFunctionsMap = new Map<number, ComponentFunction>();

    handleComponentFunction(func, componentFunctionSpans, componentFunctionsMap);

    expect(componentFunctionsMap.has(func.span.start)).toBe(true);
    expect(componentFunctionsMap.get(func.span.start)).toBe(func);
  });

  it("should not add function to map when span does not match", () => {
    const func = createMockFunctionDeclaration(100);
    const componentFunctionSpans = new Set<number>([200]);
    const componentFunctionsMap = new Map<number, ComponentFunction>();

    handleComponentFunction(func, componentFunctionSpans, componentFunctionsMap);

    expect(componentFunctionsMap.has(100)).toBe(false);
    expect(componentFunctionsMap.size).toBe(0);
  });

  it("should ensure rest parameter when span matches", () => {
    const func = createMockFunctionDeclaration(100);
    const componentFunctionSpans = new Set<number>([func.span.start]);
    const componentFunctionsMap = new Map<number, ComponentFunction>();

    handleComponentFunction(func, componentFunctionSpans, componentFunctionsMap);

    expect(func.params).toHaveLength(1);
    const param = func.params[0];
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

  it("should handle FunctionExpression", () => {
    const func = createMockFunctionExpression(100);
    const componentFunctionSpans = new Set<number>([func.span.start]);
    const componentFunctionsMap = new Map<number, ComponentFunction>();

    handleComponentFunction(func, componentFunctionSpans, componentFunctionsMap);

    expect(componentFunctionsMap.has(func.span.start)).toBe(true);
    expect(func.params).toHaveLength(1);
  });

  it("should handle ArrowFunctionExpression", () => {
    const func = createMockArrowFunctionExpression(100);
    const componentFunctionSpans = new Set<number>([func.span.start]);
    const componentFunctionsMap = new Map<number, ComponentFunction>();

    handleComponentFunction(func, componentFunctionSpans, componentFunctionsMap);

    expect(componentFunctionsMap.has(func.span.start)).toBe(true);
    expect(func.params).toHaveLength(1);
  });

  it("should not modify function when span does not match", () => {
    const func = createMockFunctionDeclaration(100);
    const initialParamsLength = func.params.length;
    const componentFunctionSpans = new Set<number>([200]);
    const componentFunctionsMap = new Map<number, ComponentFunction>();

    handleComponentFunction(func, componentFunctionSpans, componentFunctionsMap);

    expect(func.params).toHaveLength(initialParamsLength);
  });

  it("should handle function with existing parameters", () => {
    const pattern: ObjectPattern = {
      type: "ObjectPattern",
      span: createSpan(0),
      properties: [],
      optional: false,
    };

    const func: FunctionDeclaration = {
      ...createMockFunctionDeclaration(100),
      params: [
        {
          type: "Parameter",
          span: createSpan(0),
          decorators: [],
          pat: pattern,
        },
      ],
    };

    const componentFunctionSpans = new Set<number>([func.span.start]);
    const componentFunctionsMap = new Map<number, ComponentFunction>();

    handleComponentFunction(func, componentFunctionSpans, componentFunctionsMap);

    expect(componentFunctionsMap.has(func.span.start)).toBe(true);
    expect(pattern.properties.length).toBeGreaterThan(0);
  });

  it("should handle multiple functions with different spans", () => {
    const func1 = createMockFunctionDeclaration(100);
    func1.span = { start: 100, end: 200, ctxt: 0 };
    const func2 = createMockFunctionExpression(200);
    func2.span = { start: 200, end: 300, ctxt: 0 };
    const func3 = createMockArrowFunctionExpression(300);
    func3.span = { start: 300, end: 400, ctxt: 0 };

    const componentFunctionSpans = new Set<number>([func1.span.start, func2.span.start, func3.span.start]);
    const componentFunctionsMap = new Map<number, ComponentFunction>();

    handleComponentFunction(func1, componentFunctionSpans, componentFunctionsMap);
    handleComponentFunction(func2, componentFunctionSpans, componentFunctionsMap);
    handleComponentFunction(func3, componentFunctionSpans, componentFunctionsMap);

    expect(componentFunctionsMap.size).toBe(3);
    expect(componentFunctionsMap.has(func1.span.start)).toBe(true);
    expect(componentFunctionsMap.has(func2.span.start)).toBe(true);
    expect(componentFunctionsMap.has(func3.span.start)).toBe(true);
  });
});
