
import { describe, it, expect } from "vitest";
import { getComponentName } from "./getComponentName";
import type { JSXElement } from "@swc/wasm-web";

describe("getComponentName", () => {
    it("should get name from Identifier", () => {
        const element = {
            opening: {
                name: { type: "Identifier", value: "MyComponent" }
            }
        } as unknown as JSXElement;
        expect(getComponentName(element)).toBe("MyComponent");
    });

    it("should get name from JSXMemberExpression (object)", () => {
        const element = {
            opening: {
                name: { 
                    type: "JSXMemberExpression", 
                    object: { type: "Identifier", value: "Module" },
                    property: { type: "Identifier", value: "Component" }
                }
            }
        } as unknown as JSXElement;
        // The implementation specifically return elementName.object.value
        // If <Module.Component />, it returns "Module".
        expect(getComponentName(element)).toBe("Module");
    });

    it("should return null for other types", () => {
         const element = {
            opening: {
                name: { type: "JSXNamespacedName" } 
            }
        } as unknown as JSXElement;
       expect(getComponentName(element)).toBeNull();
    });
});
