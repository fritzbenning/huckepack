import type { JSXOpeningElement } from "@swc/wasm-web";
import { isIdentifier } from "@ast/type-check";
import { createJSXAttribute } from "../create/createJSXAttribute";

export function addDataInstanceNameAttribute(opening: JSXOpeningElement, componentName: string): void {
  // Check if data-instance-name attribute already exists
  const existingAttrIndex = opening.attributes.findIndex(
    (attr) => attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value === "data-instance-name"
  );

  if (existingAttrIndex !== -1) {
    // Update existing attribute value
    const existingAttr = opening.attributes[existingAttrIndex];
    if (existingAttr.type === "JSXAttribute") {
      const newAttr = createJSXAttribute("data-instance-name", componentName);
      existingAttr.value = newAttr.value as unknown as typeof existingAttr.value;
    }
  } else {
    // Add new attribute if it doesn't exist
    const dataInstanceNameAttr = createJSXAttribute("data-instance-name", componentName);
    opening.attributes.push(dataInstanceNameAttr as unknown as (typeof opening.attributes)[0]);
  }
}

export function getComponentNameFromOpening(opening: JSXOpeningElement): string | null {
  const elementName = opening.name;

  if (elementName.type === "Identifier") {
    return elementName.value;
  } else if (elementName.type === "JSXMemberExpression") {
    // Handle namespaced components like <MyComponent.SubComponent />
    if (isIdentifier(elementName.object)) {
      return elementName.object.value;
    }
  }

  return null;
}

