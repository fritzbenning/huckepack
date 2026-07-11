import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type { ArrowFunctionExpression, FunctionDeclaration, FunctionExpression, Module } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { identifyComponentFunctions } from "./identifyComponentFunctions";

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

describe("identifyComponentFunctions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ExportDefaultDeclaration", () => {
    it("should identify FunctionDeclaration in export default", () => {
      const func: FunctionDeclaration = {
        type: "FunctionDeclaration",
        span: createSpan(100),
        identifier: createIdentifier("Button", 0),
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

      const result = identifyComponentFunctions(ast, "button");

      expect(result.has(func.span.start)).toBe(true);
    });

    it("should identify FunctionExpression in export default", () => {
      const func: FunctionExpression = {
        type: "FunctionExpression",
        span: createSpan(200),
        identifier: createIdentifier("Button", 0),
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

      const result = identifyComponentFunctions(ast, "button");

      expect(result.has(func.span.start)).toBe(true);
    });
  });

  describe("ExportDefaultExpression", () => {
    it("should identify ArrowFunctionExpression via identifier export", () => {
      const func: ArrowFunctionExpression = {
        type: "ArrowFunctionExpression",
        span: createSpan(300),
        params: [],
        body: {
          type: "BlockStatement",
          span: createSpan(0),
          stmts: [],
        },
        async: false,
        generator: false,
      };

      const ast: Module = {
        type: "Module",
        span: createSpan(0),
        body: [
          {
            type: "VariableDeclaration",
            span: createSpan(0),
            kind: "const",
            declare: false,
            declarations: [
              {
                type: "VariableDeclarator",
                span: createSpan(0),
                id: createIdentifier("Button", 0),
                init: func,
                definite: false,
              },
            ],
          },
          {
            type: "ExportDefaultExpression",
            span: createSpan(0),
            expression: createIdentifier("Button", 0),
          },
        ],
      } as unknown as Module;

      const result = identifyComponentFunctions(ast, "button");

      expect(result.has(func.span.start)).toBe(true);
    });
  });

  describe("ExportNamedDeclaration", () => {
    it("should identify FunctionDeclaration in named export", () => {
      const func: FunctionDeclaration = {
        type: "FunctionDeclaration",
        span: createSpan(400),
        identifier: createIdentifier("Button", 0),
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

      const ast: Module = {
        type: "Module",
        span: createSpan(0),
        body: [
          {
            type: "ExportNamedDeclaration",
            span: createSpan(0),
            declaration: func,
            specifiers: [],
            source: null,
            typeOnly: false,
          },
        ],
      } as unknown as Module;

      const result = identifyComponentFunctions(ast, "button");

      expect(result.has(func.span.start)).toBe(true);
    });
  });

  describe("ExportDeclaration", () => {
    it("should identify FunctionDeclaration in export declaration", () => {
      const func: FunctionDeclaration = {
        type: "FunctionDeclaration",
        span: createSpan(500),
        identifier: createIdentifier("Button", 0),
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

      const ast: Module = {
        type: "Module",
        span: createSpan(0),
        body: [
          {
            type: "ExportDeclaration",
            span: createSpan(0),
            declaration: func,
          },
        ],
      } as unknown as Module;

      const result = identifyComponentFunctions(ast, "button");

      expect(result.has(func.span.start)).toBe(true);
    });
  });

  describe("VariableDeclaration", () => {
    it("should identify ArrowFunctionExpression when variable name matches fileSlug", () => {
      const func: ArrowFunctionExpression = {
        type: "ArrowFunctionExpression",
        span: createSpan(600),
        params: [],
        body: {
          type: "BlockStatement",
          span: createSpan(0),
          stmts: [],
        },
        async: false,
        generator: false,
      };

      const ast: Module = {
        type: "Module",
        span: createSpan(0),
        body: [
          {
            type: "VariableDeclaration",
            span: createSpan(0),
            kind: "const",
            declare: false,
            declarations: [
              {
                type: "VariableDeclarator",
                span: createSpan(0),
                id: createIdentifier("button", 0),
                init: func,
                definite: false,
              },
            ],
          },
        ],
      } as unknown as Module;

      const result = identifyComponentFunctions(ast, "button");

      expect(result.has(func.span.start)).toBe(true);
    });

    it("should handle case-insensitive fileSlug matching", () => {
      const func: ArrowFunctionExpression = {
        type: "ArrowFunctionExpression",
        span: createSpan(700),
        params: [],
        body: {
          type: "BlockStatement",
          span: createSpan(0),
          stmts: [],
        },
        async: false,
        generator: false,
      };

      const ast: Module = {
        type: "Module",
        span: createSpan(0),
        body: [
          {
            type: "VariableDeclaration",
            span: createSpan(0),
            kind: "const",
            declare: false,
            declarations: [
              {
                type: "VariableDeclarator",
                span: createSpan(0),
                id: createIdentifier("Button", 0),
                init: func,
                definite: false,
              },
            ],
          },
        ],
      } as unknown as Module;

      const result = identifyComponentFunctions(ast, "button");

      expect(result.has(func.span.start)).toBe(true);
    });

    it("should not identify when variable name does not match fileSlug", () => {
      const func: ArrowFunctionExpression = {
        type: "ArrowFunctionExpression",
        span: createSpan(800),
        params: [],
        body: {
          type: "BlockStatement",
          span: createSpan(0),
          stmts: [],
        },
        async: false,
        generator: false,
      };

      const ast: Module = {
        type: "Module",
        span: createSpan(0),
        body: [
          {
            type: "VariableDeclaration",
            span: createSpan(0),
            kind: "const",
            declare: false,
            declarations: [
              {
                type: "VariableDeclarator",
                span: createSpan(0),
                id: createIdentifier("OtherComponent", 0),
                init: func,
                definite: false,
              },
            ],
          },
        ],
      } as unknown as Module;

      const result = identifyComponentFunctions(ast, "button");

      expect(result.has(func.span.start)).toBe(false);
    });

    it("should not identify when init is not ArrowFunctionExpression", () => {
      const ast: Module = {
        type: "Module",
        span: createSpan(0),
        body: [
          {
            type: "VariableDeclaration",
            span: createSpan(0),
            kind: "const",
            declare: false,
            declarations: [
              {
                type: "VariableDeclarator",
                span: createSpan(0),
                id: createIdentifier("button", 0),
                init: {
                  type: "StringLiteral",
                  span: createSpan(0),
                  value: "not a function",
                  raw: '"not a function"',
                },
                definite: false,
              },
            ],
          },
        ],
      } as unknown as Module;

      const result = identifyComponentFunctions(ast, "button");

      expect(result.size).toBe(0);
    });
  });

  describe("Edge cases", () => {
    it("should return empty set when no component functions found", () => {
      const ast: Module = {
        type: "Module",
        span: createSpan(0),
        body: [],
      } as unknown as Module;

      const result = identifyComponentFunctions(ast, "button");

      expect(result.size).toBe(0);
    });

    it("should identify multiple component functions", () => {
      const func1: FunctionDeclaration = {
        type: "FunctionDeclaration",
        span: { start: 900, end: 950, ctxt: 0 },
        identifier: createIdentifier("Button", 0),
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

      const func2: FunctionExpression = {
        type: "FunctionExpression",
        span: { start: 1000, end: 1050, ctxt: 0 },
        identifier: createIdentifier("Card", 0),
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

      const ast: Module = {
        type: "Module",
        span: createSpan(0),
        body: [
          {
            type: "ExportDefaultDeclaration",
            span: createSpan(0),
            decl: func1,
          },
          {
            type: "ExportNamedDeclaration",
            span: createSpan(0),
            declaration: func2,
            specifiers: [],
            source: null,
            typeOnly: false,
          },
        ],
      } as unknown as Module;

      const result = identifyComponentFunctions(ast, "button");

      expect(result.has(func1.span.start)).toBe(true);
      expect(result.has(func2.span.start)).toBe(true);
      expect(result.size).toBe(2);
    });
  });
});
