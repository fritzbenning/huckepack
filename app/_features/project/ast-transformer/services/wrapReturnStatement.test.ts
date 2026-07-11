import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createJSXElement } from "@ast/jsx";
import { createTransformedAST } from "@ast/utils";
import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { wrapReturnStatement } from "./wrapReturnStatement";

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

describe("wrapReturnStatement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should wrap first return statement in PreviewWrapper", () => {
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

    wrapReturnStatement(transformedAst);

    // Find the return statement and check if it's wrapped
    let foundWrapped = false;
    simple(transformedAst, {
      ReturnStatement(node) {
        if (node.argument?.type === "JSXElement") {
          const wrapper = node.argument;
          if (wrapper.opening.name.type === "Identifier" && wrapper.opening.name.value === "PreviewWrapper") {
            foundWrapped = true;
          }
        }
      },
    });

    expect(foundWrapped).toBe(true);
  });

  it("should only wrap the first return statement", () => {
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
                {
                  type: "ReturnStatement",
                  span: createSpan(0),
                  argument: jsxElement2,
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

    wrapReturnStatement(transformedAst);

    let wrappedCount = 0;
    simple(transformedAst, {
      ReturnStatement(node) {
        if (node.argument?.type === "JSXElement") {
          const wrapper = node.argument;
          if (wrapper.opening.name.type === "Identifier" && wrapper.opening.name.value === "PreviewWrapper") {
            wrappedCount++;
          }
        }
      },
    });

    expect(wrappedCount).toBe(1);
  });

  it("should handle return statement with ParenthesisExpression", () => {
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
                  argument: {
                    type: "ParenthesisExpression",
                    span: createSpan(0),
                    expression: jsxElement,
                  },
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

    wrapReturnStatement(transformedAst);

    let foundWrapped = false;
    simple(transformedAst, {
      ReturnStatement(node) {
        if (node.argument?.type === "JSXElement") {
          const wrapper = node.argument;
          if (wrapper.opening.name.type === "Identifier" && wrapper.opening.name.value === "PreviewWrapper") {
            foundWrapped = true;
          }
        }
      },
    });

    expect(foundWrapped).toBe(true);
  });

  it("should not wrap when return statement has no argument", () => {
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
                  argument: null,
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

    wrapReturnStatement(transformedAst);

    let wrappedCount = 0;
    simple(transformedAst, {
      ReturnStatement(node) {
        if (node.argument?.type === "JSXElement") {
          const wrapper = node.argument;
          if (wrapper.opening.name.type === "Identifier" && wrapper.opening.name.value === "PreviewWrapper") {
            wrappedCount++;
          }
        }
      },
    });

    expect(wrappedCount).toBe(0);
  });
});
