import { isIdentifier } from "@ast/type-check";
import type { Module, TsInterfaceDeclaration, TsKeywordType, TsPropertySignature, TsUnionType } from "@swc/wasm-web";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createInterface } from "./createInterface";

// Mock dependencies
vi.mock("@ast/utils", () => ({
  createTransformedAST: vi.fn((ast) => ({ ...ast })),
}));

vi.mock("@shared/utils/format", () => ({
  toSlug: vi.fn((str) => {
    // Mock the actual toSlug behavior
    const nameWithoutExt = str.replace(/\.(tsx?|jsx?)$/, "").trim();
    const words = nameWithoutExt.split(/[\s\-_]+|[^a-zA-Z0-9]+/).filter((word: string) => word.length > 0);
    return words
      .map((word: string) => {
        const firstChar = word.charAt(0).toUpperCase();
        const rest = word.slice(1).toLowerCase();
        return firstChar + rest;
      })
      .join("");
  }),
}));

vi.mock("@ast/parameter/utils/getDeclarationFromExport", () => ({
  getDeclarationFromExport: vi.fn((item) => {
    if (item.type === "ExportDefaultDeclaration" && item.decl?.identifier) {
      return item.decl;
    }
    return null;
  }),
}));

describe("createInterface", () => {
  let mockAST: Module;

  beforeEach(() => {
    mockAST = {
      type: "Module",
      span: { start: 0, end: 200, ctxt: 0 },
      body: [
        {
          type: "ImportDeclaration",
          span: { start: 0, end: 30, ctxt: 0 },
          specifiers: [],
          source: { type: "StringLiteral", value: "react", raw: '"react"', span: { start: 20, end: 27, ctxt: 0 } },
          typeOnly: false,
        },
        {
          type: "ExportDefaultDeclaration",
          span: { start: 40, end: 200, ctxt: 0 },
          decl: {
            type: "FunctionExpression",
            span: { start: 55, end: 200, ctxt: 0 },
            identifier: {
              type: "Identifier",
              span: { start: 64, end: 75, ctxt: 2 },
              value: "MyComponent",
              optional: false,
            },
            params: [],
            body: {
              type: "BlockStatement",
              span: { start: 78, end: 200, ctxt: 0 },
              stmts: [],
            },
            generator: false,
            async: false,
          },
        },
      ],
    } as unknown as Module;
  });

  it("should create interface with string property", () => {
    const result = createInterface(mockAST, "my-component", "title", "string");

    expect(result).not.toBeNull();
    expect(result?.body).toHaveLength(3); // Import + Interface + Function

    const interfaceDecl = result?.body[1] as TsInterfaceDeclaration;
    expect(interfaceDecl.type).toBe("TsInterfaceDeclaration");
    expect(interfaceDecl.id.value).toBe("MyComponentProps");
    expect(interfaceDecl.body.body).toHaveLength(1);

    const property = interfaceDecl.body.body[0] as TsPropertySignature;
    const key = property.key && isIdentifier(property.key) ? property.key : null;
    const typeAnnotation = property.typeAnnotation?.typeAnnotation;
    expect(key?.value).toBe("title");
    expect(property.optional).toBe(false);
    expect(typeAnnotation?.type === "TsKeywordType" && (typeAnnotation as TsKeywordType).kind).toBe("string");
  });

  it("should create interface with optional property", () => {
    const result = createInterface(mockAST, "my-component", "description", "string", undefined, true);

    expect(result).not.toBeNull();

    const interfaceDecl = result?.body[1] as TsInterfaceDeclaration;
    const property = interfaceDecl.body.body[0] as TsPropertySignature;
    const key = property.key && isIdentifier(property.key) ? property.key : null;
    expect(key?.value).toBe("description");
    expect(property.optional).toBe(true);
  });

  it("should create interface with union type", () => {
    const result = createInterface(mockAST, "button", "variant", "string", ["primary", "secondary", "danger"]);

    expect(result).not.toBeNull();

    const interfaceDecl = result?.body[1] as TsInterfaceDeclaration;
    const property = interfaceDecl.body.body[0] as TsPropertySignature;
    const key = property.key && isIdentifier(property.key) ? property.key : null;
    expect(key?.value).toBe("variant");
    expect(property.typeAnnotation?.typeAnnotation.type).toBe("TsUnionType");
  });

  it("should create interface with numeric property", () => {
    const result = createInterface(mockAST, "slider", "value", "number");

    expect(result).not.toBeNull();

    const interfaceDecl = result?.body[1] as TsInterfaceDeclaration;
    const property = interfaceDecl.body.body[0] as TsPropertySignature;
    const key = property.key && isIdentifier(property.key) ? property.key : null;
    const typeAnnotation = property.typeAnnotation?.typeAnnotation;
    expect(key?.value).toBe("value");
    expect(typeAnnotation?.type === "TsKeywordType" && (typeAnnotation as TsKeywordType).kind).toBe("number");
  });

  it("should create interface with boolean property", () => {
    const result = createInterface(mockAST, "checkbox", "checked", "boolean");

    expect(result).not.toBeNull();

    const interfaceDecl = result?.body[1] as TsInterfaceDeclaration;
    const property = interfaceDecl.body.body[0] as TsPropertySignature;
    const key = property.key && isIdentifier(property.key) ? property.key : null;
    const typeAnnotation = property.typeAnnotation?.typeAnnotation;
    expect(key?.value).toBe("checked");
    expect(typeAnnotation?.type === "TsKeywordType" && (typeAnnotation as TsKeywordType).kind).toBe("boolean");
  });

  it("should insert interface before function declaration", () => {
    const result = createInterface(mockAST, "my-component", "prop", "string");

    expect(result).not.toBeNull();
    expect(result?.body).toHaveLength(3);

    // Check order: Import, Interface, Function
    expect(result?.body[0].type).toBe("ImportDeclaration");
    expect(result?.body[1].type).toBe("TsInterfaceDeclaration");
    expect(result?.body[2].type).toBe("ExportDefaultDeclaration");
  });

  it("should handle file name with special characters", () => {
    const result = createInterface(mockAST, "my-special-component_123", "prop", "string");

    expect(result).not.toBeNull();

    const interfaceDecl = result?.body[1] as TsInterfaceDeclaration;
    expect(interfaceDecl.id.value).toBe("MySpecialComponent123Props"); // Slugified
  });

  it("should insert interface after imports when function not found", () => {
    const astWithoutFunction = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ImportDeclaration",
          span: { start: 0, end: 30, ctxt: 0 },
          specifiers: [],
          source: { type: "StringLiteral", value: "react", raw: '"react"', span: { start: 20, end: 27, ctxt: 0 } },
          typeOnly: false,
        },
        {
          type: "VariableDeclaration",
          span: { start: 40, end: 80, ctxt: 0 },
          kind: "const",
          declare: false,
          declarations: [],
        },
      ],
    } as unknown as Module;

    const result = createInterface(astWithoutFunction, "component", "prop", "string");

    expect(result).not.toBeNull();
    expect(result?.body).toHaveLength(3);

    // Should insert after import (index 1)
    expect(result?.body[0].type).toBe("ImportDeclaration");
    expect(result?.body[1].type).toBe("TsInterfaceDeclaration");
    expect(result?.body[2].type).toBe("VariableDeclaration");
  });

  it("should handle AST with no imports", () => {
    const astWithoutImports = {
      type: "Module",
      span: { start: 0, end: 100, ctxt: 0 },
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: { start: 0, end: 100, ctxt: 0 },
          decl: {
            type: "FunctionExpression",
            span: { start: 15, end: 100, ctxt: 0 },
            identifier: {
              type: "Identifier",
              span: { start: 24, end: 35, ctxt: 2 },
              value: "Component",
              optional: false,
            },
            params: [],
            body: {
              type: "BlockStatement",
              span: { start: 38, end: 100, ctxt: 0 },
              stmts: [],
            },
            generator: false,
            async: false,
          },
        },
      ],
    } as unknown as Module;

    const result = createInterface(astWithoutImports, "component", "prop", "string");

    expect(result).not.toBeNull();
    expect(result?.body).toHaveLength(2);

    // Should insert at beginning (index 0)
    expect(result?.body[0].type).toBe("TsInterfaceDeclaration");
    expect(result?.body[1].type).toBe("ExportDefaultDeclaration");
  });

  it("should handle union with mixed types", () => {
    const result = createInterface(mockAST, "input", "size", "string", ["small", "medium", "large", 12, true]);

    expect(result).not.toBeNull();

    const interfaceDecl = result?.body[1] as TsInterfaceDeclaration;
    const property = interfaceDecl.body.body[0] as TsPropertySignature;
    const typeAnnotation = property.typeAnnotation?.typeAnnotation;
    expect(typeAnnotation?.type).toBe("TsUnionType");
    expect(typeAnnotation?.type === "TsUnionType" && (typeAnnotation as TsUnionType).types).toHaveLength(5);
  });

  it("should return null for invalid AST structure", () => {
    const invalidAST = {
      type: "Module",
      span: { start: 0, end: 0, ctxt: 0 },
      body: [],
    } as unknown as Module;

    const result = createInterface(invalidAST, "component", "prop", "string");

    expect(result).not.toBeNull(); // Should still work, just insert at beginning
    expect(result?.body).toHaveLength(1);
    expect(result?.body[0].type).toBe("TsInterfaceDeclaration");
  });
});
