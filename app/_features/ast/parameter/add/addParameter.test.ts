import type {
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  FunctionDeclaration,
  FunctionExpression,
  Module,
} from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { addParameter } from "./addParameter";

vi.mock("../ensure/ensureRestParameter", () => ({
  ensureRestParameter: vi.fn(),
}));

describe("addParameter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should add parameter to ExportDefaultDeclaration with existing ObjectPattern", () => {
    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: { start: 0, end: 200, ctxt: 0 },
          decl: {
            type: "FunctionExpression",
            span: { start: 15, end: 200, ctxt: 0 },
            identifier: {
              type: "Identifier",
              span: { start: 24, end: 35, ctxt: 2 },
              value: "MyComponent",
              optional: false,
            },
            params: [
              {
                type: "Parameter",
                span: { start: 36, end: 80, ctxt: 0 },
                decorators: [],
                pat: {
                  type: "ObjectPattern",
                  span: { start: 36, end: 80, ctxt: 0 },
                  properties: [],
                  optional: false,
                },
              },
            ],
            body: {
              type: "BlockStatement",
              span: { start: 82, end: 200, ctxt: 0 },
              stmts: [],
            },
            generator: false,
            async: false,
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "newParam", "string");

    expect(result).not.toBeNull();
    const exportDecl = result?.body[0] as ExportDefaultDeclaration;
    const decl = exportDecl.decl;
    if (!decl || !("params" in decl)) {
      throw new Error("Expected FunctionExpression");
    }
    const pat = (decl as FunctionExpression).params[0].pat;
    if (pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    expect(pat.properties.length).toBeGreaterThan(0);
    const property = pat.properties.find(
      (p) =>
        p.type === "AssignmentPatternProperty" && "key" in p && p.key && "value" in p.key && p.key.value === "newParam"
    );
    expect(property).toBeDefined();
  });

  it("should create ObjectPattern when it doesn't exist in ExportDefaultDeclaration", () => {
    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: { start: 0, end: 200, ctxt: 0 },
          decl: {
            type: "FunctionExpression",
            span: { start: 15, end: 200, ctxt: 0 },
            identifier: {
              type: "Identifier",
              span: { start: 24, end: 35, ctxt: 2 },
              value: "MyComponent",
              optional: false,
            },
            params: [],
            body: {
              type: "BlockStatement",
              span: { start: 82, end: 200, ctxt: 0 },
              stmts: [],
            },
            generator: false,
            async: false,
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "newParam", "string");

    expect(result).not.toBeNull();
    const exportDecl = result?.body[0] as ExportDefaultDeclaration;
    const decl = exportDecl.decl;
    if (!decl || !("params" in decl)) {
      throw new Error("Expected FunctionExpression");
    }
    expect(decl.params.length).toBeGreaterThan(0);
    const pat = (decl as FunctionExpression).params[0].pat;
    if (pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    expect(pat.properties.length).toBeGreaterThan(0);
  });

  it("should add parameter with default value", () => {
    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: { start: 0, end: 200, ctxt: 0 },
          decl: {
            type: "FunctionExpression",
            span: { start: 15, end: 200, ctxt: 0 },
            identifier: {
              type: "Identifier",
              span: { start: 24, end: 35, ctxt: 2 },
              value: "MyComponent",
              optional: false,
            },
            params: [
              {
                type: "Parameter",
                span: { start: 36, end: 80, ctxt: 0 },
                decorators: [],
                pat: {
                  type: "ObjectPattern",
                  span: { start: 36, end: 80, ctxt: 0 },
                  properties: [],
                  optional: false,
                },
              },
            ],
            body: {
              type: "BlockStatement",
              span: { start: 82, end: 200, ctxt: 0 },
              stmts: [],
            },
            generator: false,
            async: false,
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "newParam", "string", "defaultValue");

    expect(result).not.toBeNull();
    const exportDecl = result?.body[0] as ExportDefaultDeclaration;
    const decl = exportDecl.decl;
    if (!decl || !("params" in decl)) {
      throw new Error("Expected FunctionExpression");
    }
    const pat = (decl as FunctionExpression).params[0].pat;
    if (pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const property = pat.properties.find(
      (p) =>
        p.type === "AssignmentPatternProperty" && "key" in p && p.key && "value" in p.key && p.key.value === "newParam"
    );
    expect(property).toBeDefined();
    if (property && property.type === "AssignmentPatternProperty") {
      expect(property.value).toBeDefined();
    }
  });

  it("should not add parameter if it already exists", () => {
    const existingParam = {
      type: "AssignmentPatternProperty" as const,
      span: { start: 38, end: 45, ctxt: 0 },
      key: {
        type: "Identifier" as const,
        value: "existingParam",
        span: { start: 38, end: 51, ctxt: 3 },
        optional: false,
      },
      value: undefined,
    };

    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: { start: 0, end: 200, ctxt: 0 },
          decl: {
            type: "FunctionExpression",
            span: { start: 15, end: 200, ctxt: 0 },
            identifier: {
              type: "Identifier",
              span: { start: 24, end: 35, ctxt: 2 },
              value: "MyComponent",
              optional: false,
            },
            params: [
              {
                type: "Parameter",
                span: { start: 36, end: 80, ctxt: 0 },
                decorators: [],
                pat: {
                  type: "ObjectPattern",
                  span: { start: 36, end: 80, ctxt: 0 },
                  properties: [existingParam],
                  optional: false,
                },
              },
            ],
            body: {
              type: "BlockStatement",
              span: { start: 82, end: 200, ctxt: 0 },
              stmts: [],
            },
            generator: false,
            async: false,
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "existingParam", "string");

    expect(result).not.toBeNull();
    const exportDecl = result?.body[0] as ExportDefaultDeclaration;
    const decl = exportDecl.decl;
    if (!decl || !("params" in decl)) {
      throw new Error("Expected FunctionExpression");
    }
    const pat = (decl as FunctionExpression).params[0].pat;
    if (pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const existingParams = pat.properties.filter(
      (p) =>
        p.type === "AssignmentPatternProperty" &&
        "key" in p &&
        p.key &&
        "value" in p.key &&
        p.key.value === "existingParam"
    );
    expect(existingParams.length).toBe(1);
  });

  it("should add parameter to ExportNamedDeclaration", () => {
    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ExportNamedDeclaration",
          span: { start: 0, end: 200, ctxt: 0 },
          declaration: {
            type: "FunctionDeclaration",
            span: { start: 7, end: 200, ctxt: 0 },
            identifier: {
              type: "Identifier",
              span: { start: 16, end: 27, ctxt: 1 },
              value: "MyComponent",
              optional: false,
            },
            declare: false,
            params: [
              {
                type: "Parameter",
                span: { start: 28, end: 72, ctxt: 0 },
                decorators: [],
                pat: {
                  type: "ObjectPattern",
                  span: { start: 28, end: 72, ctxt: 0 },
                  properties: [],
                  optional: false,
                },
              },
            ],
            decorators: [],
            body: {
              type: "BlockStatement",
              span: { start: 74, end: 200, ctxt: 0 },
              stmts: [],
            },
            generator: false,
            async: false,
          },
          specifiers: [],
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "newParam", "string");

    expect(result).not.toBeNull();
    const exportDecl = result?.body[0] as ExportNamedDeclaration;
    const exportDeclWithDecl = exportDecl as { declaration?: FunctionDeclaration };
    const decl = exportDeclWithDecl.declaration;
    if (!decl || !("params" in decl)) {
      throw new Error("Expected FunctionDeclaration");
    }
    const pat = decl.params[0].pat;
    if (pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    expect(pat.properties.length).toBeGreaterThan(0);
  });

  it("should insert parameter before RestElement", () => {
    const restElement = {
      type: "RestElement" as const,
      span: { start: 50, end: 60, ctxt: 0 },
      rest: { start: 50, end: 53, ctxt: 0 },
      argument: {
        type: "Identifier" as const,
        value: "restProps",
        span: { start: 53, end: 62, ctxt: 1 },
        optional: false,
      },
      typeAnnotation: undefined,
    };

    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: { start: 0, end: 200, ctxt: 0 },
          decl: {
            type: "FunctionExpression",
            span: { start: 15, end: 200, ctxt: 0 },
            identifier: {
              type: "Identifier",
              span: { start: 24, end: 35, ctxt: 2 },
              value: "MyComponent",
              optional: false,
            },
            params: [
              {
                type: "Parameter",
                span: { start: 36, end: 80, ctxt: 0 },
                decorators: [],
                pat: {
                  type: "ObjectPattern",
                  span: { start: 36, end: 80, ctxt: 0 },
                  properties: [restElement as unknown as typeof restElement],
                  optional: false,
                },
              },
            ],
            body: {
              type: "BlockStatement",
              span: { start: 82, end: 200, ctxt: 0 },
              stmts: [],
            },
            generator: false,
            async: false,
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "newParam", "string");

    expect(result).not.toBeNull();
    const exportDecl = result?.body[0] as ExportDefaultDeclaration;
    const decl = exportDecl.decl;
    if (!decl || !("params" in decl)) {
      throw new Error("Expected FunctionExpression");
    }
    const pat = (decl as FunctionExpression).params[0].pat;
    if (pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const restIndex = pat.properties.findIndex((p) => p.type === "RestElement");
    const paramIndex = pat.properties.findIndex(
      (p) =>
        p.type === "AssignmentPatternProperty" && "key" in p && p.key && "value" in p.key && p.key.value === "newParam"
    );
    expect(paramIndex).toBeLessThan(restIndex);
  });

  it("should return null when no export declaration found", () => {
    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ImportDeclaration",
          span: { start: 0, end: 30, ctxt: 0 },
          specifiers: [],
          source: {
            type: "StringLiteral",
            value: "react",
            raw: '"react"',
            span: { start: 20, end: 27, ctxt: 0 },
          },
          typeOnly: false,
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "newParam", "string");

    expect(result).toBeNull();
  });

  it("should handle numeric default value", () => {
    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: { start: 0, end: 200, ctxt: 0 },
          decl: {
            type: "FunctionExpression",
            span: { start: 15, end: 200, ctxt: 0 },
            identifier: {
              type: "Identifier",
              span: { start: 24, end: 35, ctxt: 2 },
              value: "MyComponent",
              optional: false,
            },
            params: [
              {
                type: "Parameter",
                span: { start: 36, end: 80, ctxt: 0 },
                decorators: [],
                pat: {
                  type: "ObjectPattern",
                  span: { start: 36, end: 80, ctxt: 0 },
                  properties: [],
                  optional: false,
                },
              },
            ],
            body: {
              type: "BlockStatement",
              span: { start: 82, end: 200, ctxt: 0 },
              stmts: [],
            },
            generator: false,
            async: false,
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "age", "number", 25);

    expect(result).not.toBeNull();
    const exportDecl = result?.body[0] as ExportDefaultDeclaration;
    const decl = exportDecl.decl;
    if (!decl || !("params" in decl)) {
      throw new Error("Expected FunctionExpression");
    }
    const pat = (decl as FunctionExpression).params[0].pat;
    if (pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const property = pat.properties.find(
      (p) => p.type === "AssignmentPatternProperty" && "key" in p && p.key && "value" in p.key && p.key.value === "age"
    );
    expect(property).toBeDefined();
    if (property && property.type === "AssignmentPatternProperty" && property.value) {
      expect(property.value.type).toBe("NumericLiteral");
    }
  });

  it("should handle boolean default value", () => {
    const mockAST: Module = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: { start: 0, end: 200, ctxt: 0 },
          decl: {
            type: "FunctionExpression",
            span: { start: 15, end: 200, ctxt: 0 },
            identifier: {
              type: "Identifier",
              span: { start: 24, end: 35, ctxt: 2 },
              value: "MyComponent",
              optional: false,
            },
            params: [
              {
                type: "Parameter",
                span: { start: 36, end: 80, ctxt: 0 },
                decorators: [],
                pat: {
                  type: "ObjectPattern",
                  span: { start: 36, end: 80, ctxt: 0 },
                  properties: [],
                  optional: false,
                },
              },
            ],
            body: {
              type: "BlockStatement",
              span: { start: 82, end: 200, ctxt: 0 },
              stmts: [],
            },
            generator: false,
            async: false,
          },
        },
      ],
      interpreter: null,
    } as unknown as Module;

    const result = addParameter(mockAST, "test.tsx", "enabled", "boolean", true);

    expect(result).not.toBeNull();
    const exportDecl = result?.body[0] as ExportDefaultDeclaration;
    const decl = exportDecl.decl;
    if (!decl || !("params" in decl)) {
      throw new Error("Expected FunctionExpression");
    }
    const pat = (decl as FunctionExpression).params[0].pat;
    if (pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const property = pat.properties.find(
      (p) =>
        p.type === "AssignmentPatternProperty" && "key" in p && p.key && "value" in p.key && p.key.value === "enabled"
    );
    expect(property).toBeDefined();
    if (property && property.type === "AssignmentPatternProperty" && property.value) {
      expect(property.value.type).toBe("BooleanLiteral");
    }
  });
});
