import type { ArrowFunctionExpression, Module, VariableDeclaration } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addParameter } from "./addParameter";

vi.mock("../ensure/ensureRestParameter", () => ({
  ensureRestParameter: vi.fn(),
}));

describe("addParameter - Variable Declarations", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should add parameter to arrow function exported as variable (ExportDefaultExpression)", () => {
    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 500, ctxt: 0 },
      body: [
        {
          type: "VariableDeclaration",
          span: { start: 0, end: 400, ctxt: 0 },
          kind: "const",
          declare: false,
          declarations: [
            {
              type: "VariableDeclarator",
              span: { start: 6, end: 400, ctxt: 0 },
              id: {
                type: "Identifier",
                span: { start: 6, end: 17, ctxt: 2 },
                value: "HeroSection",
                optional: false,
                typeAnnotation: null,
              },
              init: {
                type: "ArrowFunctionExpression",
                span: { start: 20, end: 400, ctxt: 0 },
                params: [
                  {
                    type: "ObjectPattern",
                    span: { start: 21, end: 100, ctxt: 0 },
                    properties: [
                      {
                        type: "AssignmentPatternProperty",
                        span: { start: 23, end: 35, ctxt: 0 },
                        key: {
                          type: "Identifier",
                          span: { start: 23, end: 28, ctxt: 3 },
                          value: "title",
                          optional: false,
                          typeAnnotation: null,
                        },
                        value: {
                          type: "StringLiteral",
                          span: { start: 31, end: 35, ctxt: 0 },
                          value: "Default Title",
                          raw: '"Default Title"',
                        },
                      },
                    ],
                    optional: false,
                    typeAnnotation: {
                      type: "TsTypeAnnotation",
                      span: { start: 37, end: 54, ctxt: 0 },
                      typeAnnotation: {
                        type: "TsTypeReference",
                        span: { start: 39, end: 54, ctxt: 0 },
                        typeName: {
                          type: "Identifier",
                          span: { start: 39, end: 54, ctxt: 2 },
                          value: "HeroSectionProps",
                          optional: false,
                        },
                        typeParams: null,
                      },
                    },
                  },
                ],
                body: {
                  type: "BlockStatement",
                  span: { start: 102, end: 400, ctxt: 3 },
                  stmts: [],
                  ctxt: 3,
                },
                async: false,
                generator: false,
                typeParameters: null,
                returnType: null,
              },
              definite: false,
            },
          ],
          ctxt: 0,
        },
        {
          type: "ExportDefaultExpression",
          span: { start: 401, end: 425, ctxt: 0 },
          expression: {
            type: "Identifier",
            span: { start: 414, end: 425, ctxt: 2 },
            value: "HeroSection",
            optional: false,
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "newParam", "string", "defaultValue");

    expect(result).not.toBeNull();
    const varDecl = result?.body[0] as VariableDeclaration;
    expect(varDecl.type).toBe("VariableDeclaration");
    const declarator = varDecl.declarations[0];
    expect(declarator.init?.type).toBe("ArrowFunctionExpression");
    const arrowFunc = declarator.init as ArrowFunctionExpression;
    expect(arrowFunc.params.length).toBeGreaterThan(0);
    const param = arrowFunc.params[0];
    if (param.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const property = param.properties.find(
      (p) =>
        p.type === "AssignmentPatternProperty" && "key" in p && p.key && "value" in p.key && p.key.value === "newParam"
    );
    expect(property).toBeDefined();
    if (property && property.type === "AssignmentPatternProperty") {
      expect(property.value).toBeDefined();
      if (property.value && "value" in property.value) {
        expect(property.value.value).toBe("defaultValue");
      }
    }
  });

  it("should add parameter to arrow function exported via ExportDefaultDeclaration with identifier", () => {
    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 500, ctxt: 0 },
      body: [
        {
          type: "VariableDeclaration",
          span: { start: 0, end: 400, ctxt: 0 },
          kind: "const",
          declare: false,
          declarations: [
            {
              type: "VariableDeclarator",
              span: { start: 6, end: 400, ctxt: 0 },
              id: {
                type: "Identifier",
                span: { start: 6, end: 17, ctxt: 2 },
                value: "HeroSection",
                optional: false,
                typeAnnotation: null,
              },
              init: {
                type: "ArrowFunctionExpression",
                span: { start: 20, end: 400, ctxt: 0 },
                params: [
                  {
                    type: "ObjectPattern",
                    span: { start: 21, end: 100, ctxt: 0 },
                    properties: [],
                    optional: false,
                    typeAnnotation: {
                      type: "TsTypeAnnotation",
                      span: { start: 37, end: 54, ctxt: 0 },
                      typeAnnotation: {
                        type: "TsTypeReference",
                        span: { start: 39, end: 54, ctxt: 0 },
                        typeName: {
                          type: "Identifier",
                          span: { start: 39, end: 54, ctxt: 2 },
                          value: "HeroSectionProps",
                          optional: false,
                        },
                        typeParams: null,
                      },
                    },
                  },
                ],
                body: {
                  type: "BlockStatement",
                  span: { start: 102, end: 400, ctxt: 3 },
                  stmts: [],
                  ctxt: 3,
                },
                async: false,
                generator: false,
                typeParameters: null,
                returnType: null,
              },
              definite: false,
            },
          ],
          ctxt: 0,
        },
        {
          type: "ExportDefaultDeclaration",
          span: { start: 401, end: 425, ctxt: 0 },
          decl: {
            type: "Identifier",
            span: { start: 414, end: 425, ctxt: 2 },
            value: "HeroSection",
            optional: false,
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "newParam", "string");

    expect(result).not.toBeNull();
    const varDecl = result?.body[0] as VariableDeclaration;
    const declarator = varDecl.declarations[0];
    const arrowFunc = declarator.init as ArrowFunctionExpression;
    const param = arrowFunc.params[0];
    if (param.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const property = param.properties.find(
      (p) =>
        p.type === "AssignmentPatternProperty" && "key" in p && p.key && "value" in p.key && p.key.value === "newParam"
    );
    expect(property).toBeDefined();
  });

  it("should create ObjectPattern when it doesn't exist for arrow function", () => {
    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 500, ctxt: 0 },
      body: [
        {
          type: "VariableDeclaration",
          span: { start: 0, end: 400, ctxt: 0 },
          kind: "const",
          declare: false,
          declarations: [
            {
              type: "VariableDeclarator",
              span: { start: 6, end: 400, ctxt: 0 },
              id: {
                type: "Identifier",
                span: { start: 6, end: 17, ctxt: 2 },
                value: "HeroSection",
                optional: false,
                typeAnnotation: null,
              },
              init: {
                type: "ArrowFunctionExpression",
                span: { start: 20, end: 400, ctxt: 0 },
                params: [],
                body: {
                  type: "BlockStatement",
                  span: { start: 22, end: 400, ctxt: 3 },
                  stmts: [],
                  ctxt: 3,
                },
                async: false,
                generator: false,
                typeParameters: null,
                returnType: null,
              },
              definite: false,
            },
          ],
          ctxt: 0,
        },
        {
          type: "ExportDefaultExpression",
          span: { start: 401, end: 425, ctxt: 0 },
          expression: {
            type: "Identifier",
            span: { start: 414, end: 425, ctxt: 2 },
            value: "HeroSection",
            optional: false,
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "newParam", "string");

    expect(result).not.toBeNull();
    const varDecl = result?.body[0] as VariableDeclaration;
    const declarator = varDecl.declarations[0];
    const arrowFunc = declarator.init as ArrowFunctionExpression;
    expect(arrowFunc.params.length).toBeGreaterThan(0);
    const param = arrowFunc.params[0];
    if (param.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    expect(param.properties.length).toBeGreaterThan(0);
  });

  it("should insert parameter before RestElement in arrow function", () => {
    const restElement = {
      type: "RestElement" as const,
      span: { start: 50, end: 60, ctxt: 0 },
      rest: { start: 50, end: 53, ctxt: 0 },
      argument: {
        type: "Identifier" as const,
        value: "restProps",
        span: { start: 53, end: 62, ctxt: 1 },
        optional: false,
        typeAnnotation: null,
      },
      typeAnnotation: null,
    };

    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 500, ctxt: 0 },
      body: [
        {
          type: "VariableDeclaration",
          span: { start: 0, end: 400, ctxt: 0 },
          kind: "const",
          declare: false,
          declarations: [
            {
              type: "VariableDeclarator",
              span: { start: 6, end: 400, ctxt: 0 },
              id: {
                type: "Identifier",
                span: { start: 6, end: 17, ctxt: 2 },
                value: "HeroSection",
                optional: false,
                typeAnnotation: null,
              },
              init: {
                type: "ArrowFunctionExpression",
                span: { start: 20, end: 400, ctxt: 0 },
                params: [
                  {
                    type: "ObjectPattern",
                    span: { start: 21, end: 100, ctxt: 0 },
                    properties: [restElement as unknown as typeof restElement],
                    optional: false,
                    typeAnnotation: {
                      type: "TsTypeAnnotation",
                      span: { start: 37, end: 54, ctxt: 0 },
                      typeAnnotation: {
                        type: "TsTypeReference",
                        span: { start: 39, end: 54, ctxt: 0 },
                        typeName: {
                          type: "Identifier",
                          span: { start: 39, end: 54, ctxt: 2 },
                          value: "HeroSectionProps",
                          optional: false,
                        },
                        typeParams: null,
                      },
                    },
                  },
                ],
                body: {
                  type: "BlockStatement",
                  span: { start: 102, end: 400, ctxt: 3 },
                  stmts: [],
                  ctxt: 3,
                },
                async: false,
                generator: false,
                typeParameters: null,
                returnType: null,
              },
              definite: false,
            },
          ],
          ctxt: 0,
        },
        {
          type: "ExportDefaultExpression",
          span: { start: 401, end: 425, ctxt: 0 },
          expression: {
            type: "Identifier",
            span: { start: 414, end: 425, ctxt: 2 },
            value: "HeroSection",
            optional: false,
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "newParam", "string");

    expect(result).not.toBeNull();
    const varDecl = result?.body[0] as VariableDeclaration;
    const declarator = varDecl.declarations[0];
    const arrowFunc = declarator.init as ArrowFunctionExpression;
    const param = arrowFunc.params[0];
    if (param.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const restIndex = param.properties.findIndex((p) => p.type === "RestElement");
    const paramIndex = param.properties.findIndex(
      (p) =>
        p.type === "AssignmentPatternProperty" && "key" in p && p.key && "value" in p.key && p.key.value === "newParam"
    );
    expect(paramIndex).toBeLessThan(restIndex);
  });
});
