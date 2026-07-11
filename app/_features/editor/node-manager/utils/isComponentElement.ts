import type { JSXElement } from "@swc/wasm-web";

/**
 * HTML element names (lowercase)
 */
const HTML_ELEMENTS = new Set([
  "a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br",
  "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn",
  "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3",
  "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label",
  "legend", "li", "link", "main", "map", "mark", "menu", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup",
  "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script",
  "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody",
  "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr",
]);

/**
 * Checks if a JSX element is a React component (not an HTML element)
 * Components are typically PascalCase, while HTML elements are lowercase
 */
export function isComponentElement(element: JSXElement): boolean {
  const elementName = element.opening.name;
  
  // Get the name value
  let name: string;
  if (elementName.type === "Identifier") {
    name = elementName.value;
  } else if (elementName.type === "JSXMemberExpression") {
    // Handle namespaced components like <MyComponent.SubComponent />
    name = elementName.object.value;
  } else {
    // Unknown type, assume it's not an HTML element
    return true;
  }

  // First check: If it starts with uppercase, it's likely a component (PascalCase)
  // HTML elements are always lowercase in JSX
  const firstChar = name.charAt(0);
  if (firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase()) {
    // Starts with uppercase letter - it's a component
    return true;
  }

  // Second check: If it's lowercase and in our HTML elements list, it's HTML
  // This handles cases like <button> vs <Button>
  if (name === name.toLowerCase() && HTML_ELEMENTS.has(name.toLowerCase())) {
    return false;
  }

  // Default: assume it's a component if not explicitly HTML
  return true;
}

