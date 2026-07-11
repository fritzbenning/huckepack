
import { describe, it, expect } from "vitest";
import { isComponentUsedElsewhere } from "./isComponentUsedElsewhere";
import type { Module } from "@swc/wasm-web";

describe("isComponentUsedElsewhere", () => {
    it("should return true if component used in JSX", () => {
         const ast = {
             type: "Module",
             body: [
                 {
                     type: "ExpressionStatement",
                     expression: {
                         type: "JSXElement",
                         opening: {
                             type: "JSXOpeningElement",
                             name: { type: "Identifier", value: "MyComp" },
                             attributes: [],
                             selfClosing: false
                         },
                         children: []
                     }
                 }
             ]
         } as unknown as Module;
         
         expect(isComponentUsedElsewhere(ast, "MyComp")).toBe(true);
    });

    it("should return false if component not used", () => {
        const ast = {
            type: "Module",
            body: []
        } as unknown as Module;
        expect(isComponentUsedElsewhere(ast, "MyComp")).toBe(false);
    });
});
