import type { Module } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { classifyCodeFromAST } from "./classifyCodeFromAST";

describe("classifyCodeFromAST", () => {
  it("should classify as 'react' if exported and has function", () => {
    const ast = {
      type: "Module",
      span: { start: 0, end: 0, ctxt: 0 },
      body: [
        {
          type: "ExportDefaultDeclaration",
          span: { start: 0, end: 0, ctxt: 0 },
          decl: {
            type: "FunctionExpression",
            span: { start: 0, end: 0, ctxt: 0 },
            params: [],
            body: { type: "BlockStatement", span: { start: 0, end: 0, ctxt: 0 }, stmts: [] },
            generator: false,
            async: false,
          },
        },
      ],
    } as unknown as Module;

    expect(classifyCodeFromAST(ast)).toBe("react");
  });

  it("should classify as 'react' if exported and has JSX", () => {
    const ast = {
      type: "Module",
      span: { start: 0, end: 0, ctxt: 0 },
      body: [
        {
          type: "ExportNamedDeclaration",
          span: { start: 0, end: 0, ctxt: 0 },
          specifiers: [],
          typeOnly: false,
        },
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 0, ctxt: 0 },
          expression: {
            type: "JSXElement",
            span: { start: 0, end: 0, ctxt: 0 },
            opening: {
              type: "JSXOpeningElement",
              span: { start: 0, end: 0, ctxt: 0 },
              name: { type: "Identifier", value: "div", span: { start: 0, end: 0, ctxt: 0 }, optional: false },
              attributes: [],
              selfClosing: true,
            },
            children: [],
            closing: null,
          },
        },
      ],
    } as unknown as Module;
    expect(classifyCodeFromAST(ast)).toBe("react");
  });

  it("should classify as 'react' if it has JSX even without exports", () => {
    const ast = {
      type: "Module",
      span: { start: 0, end: 0, ctxt: 0 },
      body: [
        {
          type: "ExpressionStatement",
          span: { start: 0, end: 0, ctxt: 0 },
          expression: {
            type: "JSXFragment",
            span: { start: 0, end: 0, ctxt: 0 },
            opening: { type: "JSXOpeningFragment", span: { start: 0, end: 0, ctxt: 0 } },
            children: [],
            closing: { type: "JSXClosingFragment", span: { start: 0, end: 0, ctxt: 0 } },
          },
        },
      ],
    } as unknown as Module;
    expect(classifyCodeFromAST(ast)).toBe("react");
  });

  it("should classify as 'unsupported' if logic is not found", () => {
    const ast = {
      type: "Module",
      span: { start: 0, end: 0, ctxt: 0 },
      body: [],
    } as unknown as Module;
    expect(classifyCodeFromAST(ast)).toBe("unsupported");
  });
});
