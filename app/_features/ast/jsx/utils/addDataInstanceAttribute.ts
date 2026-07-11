import type { JSXOpeningElement } from "@swc/wasm-web";
import { createJSXAttribute } from "../create/createJSXAttribute";

export function addDataInstanceAttribute(opening: JSXOpeningElement): void {
  // Check if data-instance attribute already exists
  const existingInstanceAttrIndex = opening.attributes.findIndex(
    (attr) => attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value === "data-instance"
  );

  if (existingInstanceAttrIndex !== -1) {
    // Update existing attribute value
    const existingAttr = opening.attributes[existingInstanceAttrIndex];
    if (existingAttr.type === "JSXAttribute") {
      const newAttr = createJSXAttribute("data-instance", "true");
      existingAttr.value = newAttr.value as unknown as typeof existingAttr.value;
    }
  } else {
    // Add new attribute if it doesn't exist
    const dataInstanceAttr = createJSXAttribute("data-instance", "true");
    opening.attributes.push(dataInstanceAttr as unknown as (typeof opening.attributes)[0]);
  }
}
