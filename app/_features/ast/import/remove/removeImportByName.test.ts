import type { ImportDeclaration, Module } from "@swc/wasm-web";
import { describe, it, expect } from "vitest";
import { removeImportByName } from "./removeImportByName";

describe("removeImportByName", () => {
    it("should remove entire import if it is the only specifier matching", () => {
        const ast = {
            body: [
                {
                    type: "ImportDeclaration",
                    source: { value: "react" },
                    specifiers: [{ type: "ImportDefaultSpecifier", local: { value: "React" } }]
                }
            ]
        } as unknown as Module;
        
        const result = removeImportByName(ast, "React", "react");
        expect(result.body).toHaveLength(0);
    });

    it("should remove only the specific specifier if others exist", () => {
        const ast = {
            body: [
                {
                    type: "ImportDeclaration",
                    source: { value: "react" },
                    specifiers: [
                        { type: "ImportDefaultSpecifier", local: { value: "React" } },
                        { type: "ImportSpecifier", local: { value: "useState" } }
                    ]
                }
            ]
        } as unknown as Module;

        const result = removeImportByName(ast, "useState", "react");
        const importDecl = result.body[0] as ImportDeclaration;
        expect(importDecl.specifiers).toHaveLength(1);
        expect((importDecl.specifiers[0] as { local?: { value?: string } }).local?.value).toBe("React");
    });

    it("should do nothing if import not found", () => {
        const ast = { body: [] } as unknown as Module;
        const result = removeImportByName(ast, "React", "react");
        expect(result.body).toHaveLength(0);
    });
});
