import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { addPropsSpread, createJSXElement, findJSXElementBySpan, hasPropsSpread } from "@ast/jsx";
import { createParameterWithRestElement, getRestParameterName } from "@ast/parameter";
import { createTransformedAST } from "@ast/utils";
import type { FunctionDeclaration, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ComponentFunction } from "./handleComponentFunction";
import { matchReturnStatements } from "./matchReturnStatements";

function findFunctionInAST(ast: Module, spanStart: number): ComponentFunction | null {
  let found: ComponentFunction | null = null;
  simple(ast, {
    FunctionDeclaration(node) {
      if (found) return;
      if (node.span.start === spanStart) {
        found = node as ComponentFunction;
      }
    },
  });
  return found;
}

vi.mock("@swc/wasm-web", async () => {
  const actual = await vi.importActual("@swc/wasm-web");
  return {
    ...actual,
    printSync: vi.fn((ast: Module) => ({
      code: JSON.stringify(ast, null, 2),
      map: undefined,
    })),
  };
});

describe("matchReturnStatements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add restProps spread to root JSX element when function has restProps parameter", () => {
    const jsxElement = createJSXElement("div", []);
    const func: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 100, end: 500, ctxt: 0 },
      identifier: createIdentifier("Button", 0),
      declare: false,
      params: [createParameterWithRestElement("restProps")],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 200, end: 500, ctxt: 0 },
        stmts: [
          {
            type: "ReturnStatement",
            span: { start: 300, end: 400, ctxt: 0 },
            argument: jsxElement,
          },
        ],
      },
      generator: false,
      async: false,
    };

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [func],
    } as unknown as Module;

    const transformedAst = createTransformedAST(ast);
    const transformedFunc = findFunctionInAST(transformedAst, func.span.start);
    expect(transformedFunc).not.toBeNull();

    const componentFunctionsMap = new Map<number, ComponentFunction>();
    componentFunctionsMap.set(func.span.start, transformedFunc!);
    const spanStart = jsxElement.span.start;

    matchReturnStatements(transformedAst, componentFunctionsMap);

    const transformedJSX = findJSXElementBySpan(transformedAst, spanStart);
    expect(transformedJSX).not.toBeNull();
    expect(hasPropsSpread(transformedJSX!.opening)).toBe(true);
  });

  it("should not add duplicate spread if restProps already exists", () => {
    const jsxElement = createJSXElement("div", []);
    // Add existing spread
    addPropsSpread(jsxElement.opening, "restProps");

    const func: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 100, end: 500, ctxt: 0 },
      identifier: createIdentifier("Button", 0),
      declare: false,
      params: [createParameterWithRestElement("restProps")],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 200, end: 500, ctxt: 0 },
        stmts: [
          {
            type: "ReturnStatement",
            span: { start: 300, end: 400, ctxt: 0 },
            argument: jsxElement,
          },
        ],
      },
      generator: false,
      async: false,
    };

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [func],
    } as unknown as Module;

    const transformedAst = createTransformedAST(ast);
    const componentFunctionsMap = new Map<number, typeof func>();
    componentFunctionsMap.set(func.span.start, func);

    const initialSpreadCount = jsxElement.opening.attributes.filter((attr) => attr.type === "SpreadElement").length;

    matchReturnStatements(transformedAst, componentFunctionsMap);

    const finalSpreadCount = jsxElement.opening.attributes.filter((attr) => attr.type === "SpreadElement").length;
    expect(finalSpreadCount).toBe(initialSpreadCount);
  });

  it("should match return statement to correct parent function by span range", () => {
    const jsxElement1 = createJSXElement("div", []);
    const jsxElement2 = createJSXElement("span", []);

    const func1: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 100, end: 500, ctxt: 0 },
      identifier: createIdentifier("Button", 0),
      declare: false,
      params: [createParameterWithRestElement("restProps")],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 200, end: 500, ctxt: 0 },
        stmts: [
          {
            type: "ReturnStatement",
            span: { start: 300, end: 400, ctxt: 0 },
            argument: jsxElement1,
          },
        ],
      },
      generator: false,
      async: false,
    };

    const func2: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 600, end: 1000, ctxt: 0 },
      identifier: createIdentifier("Card", 0),
      declare: false,
      params: [createParameterWithRestElement("restProps")],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 700, end: 1000, ctxt: 0 },
        stmts: [
          {
            type: "ReturnStatement",
            span: { start: 800, end: 900, ctxt: 0 },
            argument: jsxElement2,
          },
        ],
      },
      generator: false,
      async: false,
    };

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [func1, func2],
    } as unknown as Module;

    const transformedAst = createTransformedAST(ast);
    const componentFunctionsMap = new Map<number, FunctionDeclaration>();
    componentFunctionsMap.set(func1.span.start, func1);
    componentFunctionsMap.set(func2.span.start, func2);
    const spanStart1 = jsxElement1.span.start;
    const spanStart2 = jsxElement2.span.start;

    matchReturnStatements(transformedAst, componentFunctionsMap);

    const transformedJSX1 = findJSXElementBySpan(transformedAst, spanStart1);
    const transformedJSX2 = findJSXElementBySpan(transformedAst, spanStart2);
    expect(transformedJSX1).not.toBeNull();
    expect(transformedJSX2).not.toBeNull();
    expect(hasPropsSpread(transformedJSX1!.opening)).toBe(true);
    expect(hasPropsSpread(transformedJSX2!.opening)).toBe(true);
  });

  it("should not add spread when return statement is not within any function span", () => {
    const jsxElement = createJSXElement("div", []);

    const func: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 100, end: 200, ctxt: 0 },
      identifier: createIdentifier("Button", 0),
      declare: false,
      params: [createParameterWithRestElement("restProps")],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 150, end: 200, ctxt: 0 },
        stmts: [],
      },
      generator: false,
      async: false,
    };

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [
        func,
        {
          type: "ReturnStatement",
          span: { start: 500, end: 600, ctxt: 0 },
          argument: jsxElement,
        },
      ],
    } as unknown as Module;

    const transformedAst = createTransformedAST(ast);
    const componentFunctionsMap = new Map<number, typeof func>();
    componentFunctionsMap.set(func.span.start, func);

    matchReturnStatements(transformedAst, componentFunctionsMap);

    expect(hasPropsSpread(jsxElement.opening)).toBe(false);
  });

  it("should handle return statement with ParenthesisExpression", () => {
    const jsxElement = createJSXElement("div", []);
    const func: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 100, end: 500, ctxt: 0 },
      identifier: createIdentifier("Button", 0),
      declare: false,
      params: [createParameterWithRestElement("restProps")],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 200, end: 500, ctxt: 0 },
        stmts: [
          {
            type: "ReturnStatement",
            span: { start: 300, end: 400, ctxt: 0 },
            argument: {
              type: "ParenthesisExpression",
              span: { start: 300, end: 400, ctxt: 0 },
              expression: jsxElement,
            },
          },
        ],
      },
      generator: false,
      async: false,
    };

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [func],
    } as unknown as Module;

    const transformedAst = createTransformedAST(ast);
    const componentFunctionsMap = new Map<number, typeof func>();
    componentFunctionsMap.set(func.span.start, func);
    const spanStart = jsxElement.span.start;

    matchReturnStatements(transformedAst, componentFunctionsMap);

    const transformedJSX = findJSXElementBySpan(transformedAst, spanStart);
    expect(transformedJSX).not.toBeNull();
    expect(hasPropsSpread(transformedJSX!.opening)).toBe(true);
  });

  it("should use custom rest parameter name when provided", () => {
    const jsxElement = createJSXElement("div", []);
    const func: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: { start: 100, end: 500, ctxt: 0 },
      identifier: createIdentifier("Button", 0),
      declare: false,
      params: [createParameterWithRestElement("customRest")],
      decorators: [],
      body: {
        type: "BlockStatement",
        span: { start: 200, end: 500, ctxt: 0 },
        stmts: [
          {
            type: "ReturnStatement",
            span: { start: 300, end: 400, ctxt: 0 },
            argument: jsxElement,
          },
        ],
      },
      generator: false,
      async: false,
    };

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [func],
    } as unknown as Module;

    const transformedAst = createTransformedAST(ast);
    const transformedFunc = findFunctionInAST(transformedAst, func.span.start);
    expect(transformedFunc).not.toBeNull();

    // Verify the rest parameter exists in the transformed function
    const restParamName = getRestParameterName(transformedFunc!);
    expect(restParamName).toBe("customRest");

    const componentFunctionsMap = new Map<number, ComponentFunction>();
    componentFunctionsMap.set(func.span.start, transformedFunc!);
    const spanStart = jsxElement.span.start;

    matchReturnStatements(transformedAst, componentFunctionsMap);

    const transformedJSX = findJSXElementBySpan(transformedAst, spanStart);
    expect(transformedJSX).not.toBeNull();

    // Check for spread attribute directly since hasPropsSpread only recognizes "props"/"rest" names
    const spreadAttr = transformedJSX!.opening.attributes.find((attr) => attr.type === "SpreadElement");
    expect(spreadAttr).toBeDefined();
    expect(spreadAttr?.type).toBe("SpreadElement");
    if (spreadAttr && "arguments" in spreadAttr) {
      const args = spreadAttr.arguments as { type?: string; value?: string };
      expect(args.type).toBe("Identifier");
      expect(args.value).toBe("customRest");
    }
  });
});
