
import { describe, it, expect } from "vitest";
import * as t from "./type-check";

describe("type-check utils", () => {
    it("should correctly identify ArrayExpression", () => {
        expect(t.isArrayExpression({ type: "ArrayExpression" })).toBe(true);
        expect(t.isArrayExpression({ type: "Other" })).toBe(false);
    });

    it("should correctly identify BinaryExpression", () => {
        expect(t.isBinaryExpression({ type: "BinaryExpression" })).toBe(true);
        expect(t.isBinaryExpression({ type: "Other" })).toBe(false);
    });

    it("should correctly identify BlockStatement", () => {
        expect(t.isBlockStatement({ type: "BlockStatement" })).toBe(true);
        expect(t.isBlockStatement({ type: "Other" })).toBe(false);
    });

    it("should correctly identify BooleanLiteral", () => {
        expect(t.isBooleanLiteral({ type: "BooleanLiteral" })).toBe(true);
        expect(t.isBooleanLiteral({ type: "Other" })).toBe(false);
    });

    it("should correctly identify CallExpression", () => {
        expect(t.isCallExpression({ type: "CallExpression" })).toBe(true);
        expect(t.isCallExpression({ type: "Other" })).toBe(false);
    });

    it("should correctly identify ConditionalExpression", () => {
        expect(t.isConditionalExpression({ type: "ConditionalExpression" })).toBe(true);
        expect(t.isConditionalExpression({ type: "Other" })).toBe(false);
    });

    it("should correctly identify ExportDeclaration", () => {
        expect(t.isExportDeclaration({ type: "ExportDeclaration" })).toBe(true);
        expect(t.isExportDeclaration({ type: "Other" })).toBe(false);
    });

    it("should correctly identify Identifier", () => {
        expect(t.isIdentifier({ type: "Identifier" })).toBe(true);
        expect(t.isIdentifier({ type: "Other" })).toBe(false);
    });

    it("should correctly identify JSXElement", () => {
        expect(t.isJSXElement({ type: "JSXElement" })).toBe(true);
        expect(t.isJSXElement({ type: "Other" })).toBe(false);
    });

    it("should correctly identify JSXExpressionContainer", () => {
        expect(t.isJSXExpressionContainer({ type: "JSXExpressionContainer" })).toBe(true);
        expect(t.isJSXExpressionContainer({ type: "Other" })).toBe(false);
    });

    it("should correctly identify JSXFragment", () => {
        expect(t.isJSXFragment({ type: "JSXFragment" })).toBe(true);
        expect(t.isJSXFragment({ type: "Other" })).toBe(false);
    });

    it("should correctly identify JSXText", () => {
        expect(t.isJSXText({ type: "JSXText" })).toBe(true);
        expect(t.isJSXText({ type: "Other" })).toBe(false);
    });

    it("should correctly identify MemberExpression", () => {
        expect(t.isMemberExpression({ type: "MemberExpression" })).toBe(true);
        expect(t.isMemberExpression({ type: "Other" })).toBe(false);
    });

    it("should correctly identify NumericLiteral", () => {
        expect(t.isNumericLiteral({ type: "NumericLiteral" })).toBe(true);
        expect(t.isNumericLiteral({ type: "Other" })).toBe(false);
    });

    it("should correctly identify ParenthesisExpression", () => {
        expect(t.isParenthesisExpression({ type: "ParenthesisExpression" })).toBe(true);
        expect(t.isParenthesisExpression({ type: "Other" })).toBe(false);
    });

    it("should correctly identify StringLiteral", () => {
        expect(t.isStringLiteral({ type: "StringLiteral" })).toBe(true);
        expect(t.isStringLiteral({ type: "Other" })).toBe(false);
    });

    it("should correctly identify TemplateLiteral", () => {
        expect(t.isTemplateLiteral({ type: "TemplateLiteral" })).toBe(true);
        expect(t.isTemplateLiteral({ type: "Other" })).toBe(false);
    });

    it("should correctly identify TsPropertySignature", () => {
        expect(t.isTsPropertySignature({ type: "TsPropertySignature" })).toBe(true);
        expect(t.isTsPropertySignature({ type: "Other" })).toBe(false);
    });

    it("should correctly identify TsUnionType", () => {
        expect(t.isTsUnionType({ type: "TsUnionType" })).toBe(true);
        expect(t.isTsUnionType({ type: "Other" })).toBe(false);
    });

    it("should correctly identify UnaryExpression", () => {
        expect(t.isUnaryExpression({ type: "UnaryExpression" })).toBe(true);
        expect(t.isUnaryExpression({ type: "Other" })).toBe(false);
    });

    it("should handle null/undefined", () => {
        expect(t.isIdentifier(null)).toBe(false);
        expect(t.isIdentifier(undefined)).toBe(false);
        expect(t.isIdentifier({})).toBe(false);
    });
});
