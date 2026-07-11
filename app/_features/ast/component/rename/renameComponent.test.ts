import type { ExportDefaultDeclaration, ExportNamedDeclaration, ExpressionStatement, Module } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { renameComponent } from "./renameComponent";

function withSpan(node: unknown): unknown {
  if (typeof node === "object" && node !== null) {
    const obj = node as Record<string, unknown>;
    if (!obj.span) obj.span = { start: 0, end: 0, ctxt: 0 };
    for (const key in obj) {
      if (key === "span") continue;
      if (Array.isArray(obj[key])) {
        obj[key].forEach(withSpan);
      } else if (typeof obj[key] === "object") {
        withSpan(obj[key]);
      }
    }
  }
  return node;
}

describe("renameComponent", () => {
  it("should return same AST if names are identical", () => {
    const ast = withSpan({ type: "Module", body: [] }) as unknown as Module;
    expect(renameComponent(ast, "MyComponent", "MyComponent")).toBe(ast);
  });

  it("should rename default export function declaration", () => {
    const ast = withSpan({
      type: "Module",
      body: [
        {
          type: "ExportDefaultDeclaration",
          decl: {
            type: "FunctionDeclaration",
            identifier: { type: "Identifier", value: "OldName", optional: false },
            params: [],
            body: { type: "BlockStatement", stmts: [] },
            generator: false,
            async: false,
            declare: false,
          },
        },
      ],
    }) as unknown as Module;

    const result = renameComponent(ast, "OldName", "NewName");

    expect(result).not.toBeNull();
    expect(
      ((result?.body[0] as ExportDefaultDeclaration).decl as unknown as { identifier: { value: string } }).identifier
        .value
    ).toBe("NewName");
  });

  it("should rename named export variable declaration", () => {
    const ast = withSpan({
      type: "Module",
      body: [
        {
          type: "ExportNamedDeclaration",
          specifiers: [],
          typeOnly: false,
          declaration: {
            type: "VariableDeclaration",
            kind: "const",
            declare: false,
            declarations: [
              {
                type: "VariableDeclarator",
                id: { type: "Identifier", value: "OldName", optional: false },
                definite: false,
              },
            ],
          },
        },
      ],
    }) as unknown as Module;

    const result = renameComponent(ast, "OldName", "NewName");

    expect(result).not.toBeNull();
    expect(
      (
        result?.body[0] as ExportNamedDeclaration as unknown as {
          declaration: { declarations: Array<{ id: { value: string } }> };
        }
      ).declaration.declarations[0].id.value
    ).toBe("NewName");
  });

  it("should rename usage in JSX", () => {
    const ast = withSpan({
      type: "Module",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "JSXElement",
            opening: {
              type: "JSXOpeningElement",
              name: { type: "Identifier", value: "OldName", optional: false },
              attributes: [],
              selfClosing: false,
            },
            closing: {
              type: "JSXClosingElement",
              name: { type: "Identifier", value: "OldName", optional: false },
            },
            children: [],
          },
        },
      ],
    }) as unknown as Module;

    const result = renameComponent(ast, "OldName", "NewName");

    expect(result).not.toBeNull();
    expect(
      ((result?.body[0] as ExpressionStatement).expression as unknown as { opening: { name: { value: string } } })
        .opening.name.value
    ).toBe("NewName");
    expect(
      ((result?.body[0] as ExpressionStatement).expression as unknown as { closing: { name: { value: string } } })
        .closing.name.value
    ).toBe("NewName");
  });

  it("should rename usage in JSX MemberExpression", () => {
    const ast = withSpan({
      type: "Module",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "JSXElement",
            opening: {
              type: "JSXOpeningElement",
              name: {
                type: "JSXMemberExpression",
                object: { type: "Identifier", value: "OldName", optional: false },
                property: { type: "Identifier", value: "Sub", optional: false },
              },
              attributes: [],
              selfClosing: false,
            },
            closing: {
              type: "JSXClosingElement",
              name: {
                type: "JSXMemberExpression",
                object: { type: "Identifier", value: "OldName", optional: false },
                property: { type: "Identifier", value: "Sub", optional: false },
              },
            },
            children: [],
          },
        },
      ],
    }) as unknown as Module;

    const result = renameComponent(ast, "OldName", "NewName");

    expect(result).not.toBeNull();
    expect(
      (
        (result?.body[0] as ExpressionStatement).expression as unknown as {
          opening: { name: { object: { value: string } } };
        }
      ).opening.name.object.value
    ).toBe("NewName");
    expect(
      (
        (result?.body[0] as ExpressionStatement).expression as unknown as {
          closing: { name: { object: { value: string } } };
        }
      ).closing.name.object.value
    ).toBe("NewName");
  });

  it("should return null if component not found", () => {
    const ast = withSpan({
      type: "Module",
      body: [],
    }) as unknown as Module;

    const result = renameComponent(ast, "OldName", "NewName");

    expect(result).toBeNull();
  });
});
