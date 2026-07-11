
import { describe, it, expect } from "vitest";
import { createTransformedAST } from "./createTransformedAST";
import type { Module } from "@swc/wasm-web";

describe("createTransformedAST", () => {
    it("should return a shallow copy of AST structure", () => {
      const ast = { type: "Module", body: [] } as unknown as Module;
      const result = createTransformedAST(ast);
      expect(result).not.toBe(ast);
      expect(result.body).not.toBe(ast.body); // Body array should be new
      expect(result.body).toEqual(ast.body);
    });
});
