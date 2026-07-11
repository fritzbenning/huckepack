import type { ImportDeclaration, Module } from "@swc/wasm-web";
import { describe, it, expect } from "vitest";
import { removeImport } from "./removeImport";

describe("removeImport", () => {
    it("should remove import if it matches source and specifiers", () => {
        const importDecl = {
             type: "ImportDeclaration",
             source: { value: "react" },
             specifiers: [{ type: "ImportDefaultSpecifier", local: { value: "React" } }]
        };
        
        const ast = {
            body: [
                { ...importDecl }, // Copy to be removed
                { type: "ExpressionStatement" }
            ]
        } as unknown as Module;

        const result = removeImport(ast, importDecl as unknown as ImportDeclaration);
        expect(result.body).toHaveLength(1);
        expect(result.body[0].type).toBe("ExpressionStatement");
    });
    
    it("should not remove import if specifiers differ", () => {
        const ast = {
              body: [
                  {
                      type: "ImportDeclaration",
                      source: { value: "react" },
                      specifiers: [{ type: "ImportDefaultSpecifier", local: { value: "React" } }]
                  }
              ]
        } as unknown as Module;
          
        const target = {
              type: "ImportDeclaration",
              source: { value: "react" },
              specifiers: [{ type: "ImportSpecifier", local: { value: "useState" } }]
        };
          
        const result = removeImport(ast, target as unknown as ImportDeclaration);
        expect(result.body).toHaveLength(1);
    });
});
