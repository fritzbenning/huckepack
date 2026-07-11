import type { Module } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { extractComponentNameFromAST } from "./extractComponentName";

// Helper to create basic AST structures for testing
// We don't need to test `extractComponentName` (the string version) heavily if we assume `convertToAST` works.
// Focus on `extractComponentNameFromAST`.

describe("extractComponentNameFromAST", () => {
  it("should extract component name from default export identifier", () => {
    // export default function MyComponent() {}
    const ast = {
      type: "Module",
      span: { start: 0, end: 0, ctxt: 0 },
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: { start: 0, end: 0, ctxt: 0 },
          decl: {
            type: "FunctionDeclaration",
            identifier: {
              type: "Identifier",
              value: "MyComponent",
              span: { start: 0, end: 0, ctxt: 0 },
              optional: false,
            },
            span: { start: 0, end: 0, ctxt: 0 },
            params: [],
            body: { type: "BlockStatement", span: { start: 0, end: 0, ctxt: 0 }, stmts: [] },
            generator: false,
            async: false,
            declare: false,
          },
        },
      ],
    } as unknown as Module;

    expect(extractComponentNameFromAST(ast)).toBe("MyComponent");
  });

  it("should extract component name from named export variable", () => {
    // export const MyComponent = ...
    const ast = {
      type: "Module",
      span: { start: 0, end: 0, ctxt: 0 },
      body: [
        {
          type: "ExportNamedDeclaration",
          span: { start: 0, end: 0, ctxt: 0 },
          specifiers: [],
          typeOnly: false,
          declaration: {
            type: "VariableDeclaration",
            span: { start: 0, end: 0, ctxt: 0 },
            kind: "const",
            declare: false,
            declarations: [
              {
                type: "VariableDeclarator",
                span: { start: 0, end: 0, ctxt: 0 },
                id: {
                  type: "Identifier",
                  value: "MyComponent",
                  span: { start: 0, end: 0, ctxt: 0 },
                  optional: false,
                },
                definite: false,
              },
            ],
          },
        },
      ],
    } as unknown as Module;

    expect(extractComponentNameFromAST(ast)).toBe("MyComponent");
  });

  it("should return null if no component name found", () => {
    const ast = {
      type: "Module",
      span: { start: 0, end: 0, ctxt: 0 },
      body: [],
    } as unknown as Module;

    expect(extractComponentNameFromAST(ast)).toBeNull();
  });
});
