import { isIdentifier } from "@ast/type-check";
import type { JSXOpeningElement } from "@swc/wasm-web";

export function hasPropsSpread(opening: JSXOpeningElement): boolean {
  return opening.attributes.some((attr) => {
    // Check if it's a spread attribute (SpreadElement) by checking for the arguments property (plural)
    if (attr.type === "SpreadElement" && "arguments" in attr && attr.arguments) {
      const argument = attr.arguments as { type?: string; value?: string };

      // Check if it's {...props} or similar
      if (argument && typeof argument === "object") {
        if (argument.type === "Identifier" && isIdentifier(argument)) {
          // Common prop names: props, rest, ...props, etc.
          const propName = argument.value?.toLowerCase() || "";
          return propName === "props" || propName.includes("props") || propName === "rest";
        }
      }
    }
    return false;
  });
}
