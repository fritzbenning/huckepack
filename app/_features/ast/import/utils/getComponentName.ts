import { isIdentifier } from "@ast/type-check";
import type { JSXElement } from "@swc/wasm-web";

export function getComponentName(element: JSXElement): string | null {
  const elementName = element.opening.name;

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
