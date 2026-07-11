import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createJSXAttribute, createJSXElement, findJSXElementBySpan } from "@ast/jsx";
import { createTransformedAST } from "@ast/utils";
import type { Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { transformJSXElements } from "./transformJSXElements";

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

describe("transformJSXElements", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should remove onClick attributes from JSX elements", () => {
    const jsxElement = createJSXElement("button", []);
    jsxElement.opening.attributes.push(createJSXAttribute("onClick", "handleClick"));
    jsxElement.opening.attributes.push(createJSXAttribute("className", "btn"));

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: createSpan(0),
          decl: {
            type: "FunctionDeclaration",
            span: createSpan(0),
            identifier: createIdentifier("Button", 0),
            declare: false,
            params: [],
            decorators: [],
            body: {
              type: "BlockStatement",
              span: createSpan(0),
              stmts: [
                {
                  type: "ReturnStatement",
                  span: createSpan(0),
                  argument: jsxElement,
                },
              ],
            },
            generator: false,
            async: false,
          },
        },
      ],
    } as unknown as Module;

    const transformedAst = createTransformedAST(ast);
    const spanMap = new Map<number, string>();
    const spanStart = jsxElement.span.start;

    transformJSXElements(transformedAst, spanMap);

    const transformedJSX = findJSXElementBySpan(transformedAst, spanStart);
    expect(transformedJSX).not.toBeNull();
    const onClickAttributes = transformedJSX!.opening.attributes.filter(
      (attr) => attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value === "onClick"
    );
    expect(onClickAttributes).toHaveLength(0);
  });

  it("should add data-node-id attribute when spanMap contains the span", () => {
    const jsxElement = createJSXElement("div", []);
    const spanStart = jsxElement.span.start;

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: createSpan(0),
          decl: {
            type: "FunctionDeclaration",
            span: createSpan(0),
            identifier: createIdentifier("Component", 0),
            declare: false,
            params: [],
            decorators: [],
            body: {
              type: "BlockStatement",
              span: createSpan(0),
              stmts: [
                {
                  type: "ReturnStatement",
                  span: createSpan(0),
                  argument: jsxElement,
                },
              ],
            },
            generator: false,
            async: false,
          },
        },
      ],
    } as unknown as Module;

    const transformedAst = createTransformedAST(ast);
    const spanMap = new Map<number, string>();
    spanMap.set(spanStart, "div[0]");

    transformJSXElements(transformedAst, spanMap);

    const transformedJSX = findJSXElementBySpan(transformedAst, spanStart);
    expect(transformedJSX).not.toBeNull();
    const dataNodeIdAttr = transformedJSX!.opening.attributes.find(
      (attr) => attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value === "data-node-id"
    );
    expect(dataNodeIdAttr).toBeDefined();
    if (dataNodeIdAttr && dataNodeIdAttr.type === "JSXAttribute" && dataNodeIdAttr.value?.type === "StringLiteral") {
      expect(dataNodeIdAttr.value.value).toBe("div[0]");
    }
  });

  it("should not add data-node-id when spanMap does not contain the span", () => {
    const jsxElement = createJSXElement("div", []);

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: createSpan(0),
          decl: {
            type: "FunctionDeclaration",
            span: createSpan(0),
            identifier: createIdentifier("Component", 0),
            declare: false,
            params: [],
            decorators: [],
            body: {
              type: "BlockStatement",
              span: createSpan(0),
              stmts: [
                {
                  type: "ReturnStatement",
                  span: createSpan(0),
                  argument: jsxElement,
                },
              ],
            },
            generator: false,
            async: false,
          },
        },
      ],
    } as unknown as Module;

    const transformedAst = createTransformedAST(ast);
    const spanMap = new Map<number, string>();
    const spanStart = jsxElement.span.start;

    transformJSXElements(transformedAst, spanMap);

    const transformedJSX = findJSXElementBySpan(transformedAst, spanStart);
    expect(transformedJSX).not.toBeNull();
    const dataNodeIdAttr = transformedJSX!.opening.attributes.find(
      (attr) => attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value === "data-node-id"
    );
    expect(dataNodeIdAttr).toBeUndefined();
  });

  it("should add data-instance and data-instance-name when componentMap is provided", () => {
    const jsxElement = createJSXElement("Button", []);
    const spanStart = jsxElement.span.start;

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: createSpan(0),
          decl: {
            type: "FunctionDeclaration",
            span: createSpan(0),
            identifier: createIdentifier("Component", 0),
            declare: false,
            params: [],
            decorators: [],
            body: {
              type: "BlockStatement",
              span: createSpan(0),
              stmts: [
                {
                  type: "ReturnStatement",
                  span: createSpan(0),
                  argument: jsxElement,
                },
              ],
            },
            generator: false,
            async: false,
          },
        },
      ],
    } as unknown as Module;

    const transformedAst = createTransformedAST(ast);
    const spanMap = new Map<number, string>();
    spanMap.set(spanStart, "Button[0]");
    const componentMap = new Map<number, boolean>();
    componentMap.set(spanStart, true);

    transformJSXElements(transformedAst, spanMap, componentMap);

    const transformedJSX = findJSXElementBySpan(transformedAst, spanStart);
    expect(transformedJSX).not.toBeNull();
    const dataInstanceAttr = transformedJSX!.opening.attributes.find(
      (attr) => attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value === "data-instance"
    );
    expect(dataInstanceAttr).toBeDefined();

    const dataInstanceNameAttr = transformedJSX!.opening.attributes.find(
      (attr) =>
        attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value === "data-instance-name"
    );
    expect(dataInstanceNameAttr).toBeDefined();
    if (
      dataInstanceNameAttr &&
      dataInstanceNameAttr.type === "JSXAttribute" &&
      dataInstanceNameAttr.value?.type === "StringLiteral"
    ) {
      expect(dataInstanceNameAttr.value.value).toBe("Button");
    }
  });

  it("should handle multiple JSX elements", () => {
    const jsxElement1 = createJSXElement("div", []);
    const jsxElement2 = createJSXElement("span", []);

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: createSpan(0),
          decl: {
            type: "FunctionDeclaration",
            span: createSpan(0),
            identifier: createIdentifier("Component", 0),
            declare: false,
            params: [],
            decorators: [],
            body: {
              type: "BlockStatement",
              span: createSpan(0),
              stmts: [
                {
                  type: "ReturnStatement",
                  span: createSpan(0),
                  argument: jsxElement1,
                },
              ],
            },
            generator: false,
            async: false,
          },
        },
      ],
    } as unknown as Module;

    // Add second element as child
    jsxElement1.children.push(jsxElement2);

    const transformedAst = createTransformedAST(ast);
    const spanMap = new Map<number, string>();
    spanMap.set(jsxElement1.span.start, "div[0]");
    spanMap.set(jsxElement2.span.start, "div[0]>span[0]");

    transformJSXElements(transformedAst, spanMap);

    const transformedJSX1 = findJSXElementBySpan(transformedAst, jsxElement1.span.start);
    const transformedJSX2 = findJSXElementBySpan(transformedAst, jsxElement2.span.start);
    expect(transformedJSX1).not.toBeNull();
    expect(transformedJSX2).not.toBeNull();

    const attr1 = transformedJSX1!.opening.attributes.find(
      (attr) => attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value === "data-node-id"
    );
    const attr2 = transformedJSX2!.opening.attributes.find(
      (attr) => attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value === "data-node-id"
    );

    expect(attr1).toBeDefined();
    expect(attr2).toBeDefined();
  });
});
