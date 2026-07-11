import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createJSXElement } from "@ast/jsx";
import type { FunctionDeclaration, ImportDeclaration, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPreviewVersion } from "./createPreviewVersion";

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

describe("createPreviewVersion", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should add PreviewWrapper import", () => {
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

    const result = createPreviewVersion(ast);

    let foundImport = false;
    simple(result.ast, {
      ImportDeclaration(node) {
        const importDecl = node as ImportDeclaration;
        if (importDecl.source?.type === "StringLiteral" && importDecl.source.value === "./toolkit/PreviewWrapper.tsx") {
          foundImport = true;
        }
      },
    });
    expect(foundImport).toBe(true);
  });

  it("should wrap return statement JSX in PreviewWrapper", () => {
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

    const result = createPreviewVersion(ast);

    let foundWrapper = false;
    simple(result.ast, {
      JSXElement(node) {
        if (node.opening.name.type === "Identifier" && node.opening.name.value === "PreviewWrapper") {
          foundWrapper = true;
        }
      },
    });
    expect(foundWrapper).toBe(true);
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

    const result = createPreviewVersion(ast);

    let wrapperCount = 0;
    simple(result.ast, {
      JSXElement(node) {
        if (node.opening.name.type === "Identifier" && node.opening.name.value === "PreviewWrapper") {
          wrapperCount++;
        }
      },
    });
    expect(wrapperCount).toBe(1);
  });

  it("should handle return statement with parenthesis expression", () => {
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

    const result = createPreviewVersion(ast);

    let foundWrapper = false;
    let foundDiv = false;
    simple(result.ast, {
      JSXElement(node) {
        if (node.opening.name.type === "Identifier" && node.opening.name.value === "PreviewWrapper") {
          foundWrapper = true;
        }
        if (node.opening.name.type === "Identifier" && node.opening.name.value === "div") {
          foundDiv = true;
        }
      },
    });
    expect(foundWrapper).toBe(true);
    expect(foundDiv).toBe(true);
  });

  it("should return code and ast", () => {
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

    const result = createPreviewVersion(ast);

    expect(result).toHaveProperty("code");
    expect(result).toHaveProperty("ast");
    expect(typeof result.code).toBe("string");
    expect(result.ast).toBeDefined();
  });

  it("should handle component with JSX return", () => {
    const jsxElement = createJSXElement("button", []);
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

    const result = createPreviewVersion(ast);

    let foundWrapper = false;
    let foundButton = false;
    simple(result.ast, {
      JSXElement(node) {
        if (node.opening.name.type === "Identifier" && node.opening.name.value === "PreviewWrapper") {
          foundWrapper = true;
        }
        if (node.opening.name.type === "Identifier" && node.opening.name.value === "button") {
          foundButton = true;
        }
      },
    });
    expect(foundWrapper).toBe(true);
    expect(foundButton).toBe(true);
  });

  it("should preserve component structure", () => {
    const jsxElement = createJSXElement("div", []);
    const func: FunctionDeclaration = {
      type: "FunctionDeclaration",
      span: createSpan(0),
      identifier: createIdentifier("ProductCard", 0),
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
    };

    const ast: Module = {
      type: "Module",
      span: createSpan(0),
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: createSpan(0),
          decl: func,
        },
      ],
    } as unknown as Module;

    const result = createPreviewVersion(ast);

    let foundComponent = false;
    simple(result.ast, {
      FunctionDeclaration(node) {
        if (node.identifier && node.identifier.type === "Identifier" && node.identifier.value === "ProductCard") {
          foundComponent = true;
        }
      },
    });
    expect(foundComponent).toBe(true);
  });
});
