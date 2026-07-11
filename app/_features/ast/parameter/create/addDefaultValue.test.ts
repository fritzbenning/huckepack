import type {
  BooleanLiteral,
  ExportDefaultDeclaration,
  FunctionExpression,
  Module,
  NumericLiteral,
  StringLiteral,
} from "@swc/wasm-web";
import { beforeEach, describe, expect, it } from "vitest";
import { addDefaultValue } from "./addDefaultValue";

describe("addDefaultValue", () => {
  let mockAST: Module;

  beforeEach(() => {
    mockAST = {
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
                  properties: [
                    {
                      type: "AssignmentPatternProperty",
                      span: { start: 38, end: 42, ctxt: 0 },
                      key: {
                        type: "Identifier",
                        span: { start: 38, end: 42, ctxt: 3 },
                        value: "name",
                        optional: false,
                      },
                      value: undefined, // No default value
                    },
                    {
                      type: "AssignmentPatternProperty",
                      span: { start: 44, end: 48, ctxt: 0 },
                      key: {
                        type: "Identifier",
                        span: { start: 44, end: 48, ctxt: 3 },
                        value: "age",
                        optional: false,
                      },
                      value: {
                        type: "NumericLiteral",
                        span: { start: 51, end: 53, ctxt: 0 },
                        value: 25,
                        raw: "25",
                      }, // Already has default value
                    },
                  ],
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
    } as unknown as Module;
  });

  it("should add default string value to parameter without default", () => {
    const result = addDefaultValue(mockAST, "name", "John Doe", "StringLiteral");

    expect(result).not.toBeNull();
    expect(result?.body).toHaveLength(1);

    const exportDecl = result?.body[0] as ExportDefaultDeclaration;
    const decl = exportDecl.decl;
    if (!decl || !("params" in decl)) {
      throw new Error("Expected FunctionExpression");
    }
    const pat = (decl as FunctionExpression).params[0].pat;
    if (pat.type !== "ObjectPattern") {
      throw new Error("Expected ObjectPattern");
    }
    const property = pat.properties[0];
    if (property.type !== "AssignmentPatternProperty") {
      throw new Error("Expected AssignmentPatternProperty");
    }
    const param = property;

    expect(param.value).not.toBeNull();
    const stringValue = param.value as StringLiteral;
    expect(stringValue.type).toBe("StringLiteral");
    expect(stringValue.value).toBe("John Doe");
    expect(stringValue.raw).toBe('"John Doe"');
  });

  it("should add default numeric value to parameter without default", () => {
    const result = addDefaultValue(mockAST, "name", 42, "NumericLiteral");

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
    const property = pat.properties[0];
    if (property.type !== "AssignmentPatternProperty") {
      throw new Error("Expected AssignmentPatternProperty");
    }
    const param = property;

    const numericValue = param.value as NumericLiteral;
    expect(numericValue.type).toBe("NumericLiteral");
    expect(numericValue.value).toBe(42);
    expect(numericValue.raw).toBe("42");
  });

  it("should add default boolean value to parameter without default", () => {
    const result = addDefaultValue(mockAST, "name", true, "BooleanLiteral");

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
    const property = pat.properties[0];
    if (property.type !== "AssignmentPatternProperty") {
      throw new Error("Expected AssignmentPatternProperty");
    }
    const param = property;

    const booleanValue = param.value as BooleanLiteral;
    expect(booleanValue.type).toBe("BooleanLiteral");
    expect(booleanValue.value).toBe(true);
  });

  it("should return null when parameter already has default value", () => {
    const result = addDefaultValue(mockAST, "age", "30", "StringLiteral");

    expect(result).toBeNull(); // Should not modify since age already has default
  });

  it("should return null when parameter not found", () => {
    const result = addDefaultValue(mockAST, "nonExistentParam", "value", "StringLiteral");

    expect(result).toBeNull();
  });

  it("should handle boolean false value", () => {
    const result = addDefaultValue(mockAST, "name", false, "BooleanLiteral");

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
    const property = pat.properties[0];
    if (property.type !== "AssignmentPatternProperty") {
      throw new Error("Expected AssignmentPatternProperty");
    }
    const param = property;

    const booleanValue = param.value as BooleanLiteral;
    expect(booleanValue.type).toBe("BooleanLiteral");
    expect(booleanValue.value).toBe(false);
  });

  it("should handle zero numeric value", () => {
    const result = addDefaultValue(mockAST, "name", 0, "NumericLiteral");

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
    const property = pat.properties[0];
    if (property.type !== "AssignmentPatternProperty") {
      throw new Error("Expected AssignmentPatternProperty");
    }
    const param = property;

    const numericValue = param.value as NumericLiteral;
    expect(numericValue.type).toBe("NumericLiteral");
    expect(numericValue.value).toBe(0);
    expect(numericValue.raw).toBe("0");
  });

  it("should handle empty string value", () => {
    const result = addDefaultValue(mockAST, "name", "", "StringLiteral");

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
    const property = pat.properties[0];
    if (property.type !== "AssignmentPatternProperty") {
      throw new Error("Expected AssignmentPatternProperty");
    }
    const param = property;

    const stringValue = param.value as StringLiteral;
    expect(stringValue.type).toBe("StringLiteral");
    expect(stringValue.value).toBe("");
    expect(stringValue.raw).toBe('""');
  });

  it("should update span correctly when adding default value", () => {
    const result = addDefaultValue(mockAST, "name", "test", "StringLiteral");

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
    const property = pat.properties[0];
    if (property.type !== "AssignmentPatternProperty") {
      throw new Error("Expected AssignmentPatternProperty");
    }
    const param = property;

    expect(param.span.end).toBeGreaterThan(param.span.start);
    const stringValue = param.value as StringLiteral;
    expect(stringValue.span).toBeDefined();
    expect(stringValue.span.start).toBeGreaterThanOrEqual(param.key.span.end);
  });
});
