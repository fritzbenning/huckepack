import { getJSXChildrenText } from "@ast/jsx";
import { isIdentifier } from "@ast/type-check";
import type { JSXAttribute, JSXElement, JSXOpeningElement } from "@swc/wasm-web";
import { getJSXAttributeValue } from "./getJSXAttributeValue";

/**
 * Gets all JSX attributes from an opening element as a record of name -> value
 * Excludes "children" prop - children should be read from JSX children using getJSXChildrenText
 */
export function getJSXAttributes(
  opening: JSXOpeningElement,
  element?: JSXElement
): Record<string, string | number | boolean | null> {
  const attributes: Record<string, string | number | boolean | null> = {};

  for (const attr of opening.attributes) {
    if (attr.type === "JSXAttribute") {
      const jsxAttr = attr as JSXAttribute;
      const name = isIdentifier(jsxAttr.name) ? jsxAttr.name.value : null;

      if (name && name !== "children") {
        attributes[name] = getJSXAttributeValue(jsxAttr);
      }
    }
  }

  // If element is provided, read children from JSX children
  if (element) {
    const childrenText = getJSXChildrenText(element);
    if (childrenText !== null) {
      attributes.children = childrenText;
    }
  }

  return attributes;
}
