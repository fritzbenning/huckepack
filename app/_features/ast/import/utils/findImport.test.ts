
import { describe, it, expect } from "vitest";
import { findImport } from "./findImport";
import type { Module } from "@swc/wasm-web";

describe("findImport", () => {
    const mockAst = {
        body: [
            {
                type: "ImportDeclaration",
                source: { value: "react" },
                specifiers: [
                    { type: "ImportDefaultSpecifier", local: { value: "React" } },
                    { type: "ImportSpecifier", local: { value: "useState" } },
                    { type: "ImportSpecifier", local: { value: "useEffect" }, imported: { value: "useEffect" } }
                ]
            },
            {
                type: "ImportDeclaration",
                source: { value: "some-lib" },
                specifiers: [
                     { type: "ImportSpecifier", local: { value: "AliasedName" }, imported: { value: "OriginalName" } }
                ]
            }
        ]
    } as unknown as Module;

    it("should find import by default specifier", () => {
        expect(findImport(mockAst, "React", "react")).toBeDefined();
    });

    it("should find import by specifier local name", () => {
        expect(findImport(mockAst, "useState", "react")).toBeDefined();
    });

    it("should find import by matching imported name (aliasing case)", () => {
        // Code: importedName === componentName || spec.local.value === componentName
        expect(findImport(mockAst, "OriginalName", "some-lib")).toBeDefined();
    });

    it("should find import by matching alias name", () => {
        expect(findImport(mockAst, "AliasedName", "some-lib")).toBeDefined();
    });

    it("should return null if import not found", () => {
        expect(findImport(mockAst, "useRef", "react")).toBeNull();
    });

    it("should return null if source path mismatches", () => {
        expect(findImport(mockAst, "React", "vue")).toBeNull();
    });
});
