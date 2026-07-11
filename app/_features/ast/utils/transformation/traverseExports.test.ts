import type { FunctionDeclaration, FunctionExpression, Module } from "@swc/wasm-web";
import { describe, expect, it } from "vitest";
import { traverseExports } from "./traverseExports";

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

describe("traverseExports", () => {
  it("should traverse named exports", () => {
    const ast = withSpan({
      type: "Module",
      body: [
        {
          type: "ExportNamedDeclaration",
          specifiers: [],
          typeOnly: false,
          declaration: {
            type: "FunctionDeclaration",
            identifier: { type: "Identifier", value: "TestFunc", optional: false },
            params: [],
            body: { type: "BlockStatement", stmts: [] },
            generator: false,
            async: false,
            declare: false,
          },
        },
      ],
    }) as unknown as Module;

    let foundName = "";
    const { found } = traverseExports(ast, (decl: FunctionDeclaration | FunctionExpression) => {
      if (decl.type === "FunctionDeclaration" && decl.identifier?.value === "TestFunc") {
        foundName = decl.identifier.value;
        return true;
      }
      return false;
    });

    expect(found).toBe(true);
    expect(foundName).toBe("TestFunc");
  });

  it("should traverse default exports (function)", () => {
    const ast = withSpan({
      type: "Module",
      body: [
        {
          type: "ExportDefaultDeclaration",
          decl: {
            type: "FunctionDeclaration",
            identifier: { type: "Identifier", value: "DefaultFunc", optional: false },
            params: [],
            body: { type: "BlockStatement", stmts: [] },
            generator: false,
            async: false,
            declare: false,
          },
        },
      ],
    }) as unknown as Module;

    let foundName = "";
    const { found } = traverseExports(ast, (decl: FunctionDeclaration | FunctionExpression) => {
      if (decl.type === "FunctionDeclaration" && decl.identifier) {
        foundName = decl.identifier.value;
      }
      return true;
    });

    expect(found).toBe(true);
    expect(foundName).toBe("DefaultFunc");
  });
});
