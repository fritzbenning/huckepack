import type { JSXOpeningElement } from "@swc/wasm-web";
import { createJSXAttribute } from "../create/createJSXAttribute";

export function addDataNodeIdAttribute(opening: JSXOpeningElement, nodeId: string): void {
  // Check if data-node-id attribute already exists
  const existingAttrIndex = opening.attributes.findIndex(
    (attr) => attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value === "data-node-id"
  );

  if (existingAttrIndex !== -1) {
    // Update existing attribute value
    const existingAttr = opening.attributes[existingAttrIndex];
    if (existingAttr.type === "JSXAttribute") {
      const newAttr = createJSXAttribute("data-node-id", nodeId);
      existingAttr.value = newAttr.value as unknown as typeof existingAttr.value;
    }
  } else {
    // Add new attribute if it doesn't exist
    const dataNodeIdAttr = createJSXAttribute("data-node-id", nodeId);
    opening.attributes.push(dataNodeIdAttr as unknown as (typeof opening.attributes)[0]);
  }
}
