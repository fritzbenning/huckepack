import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type { JSXOpeningElement } from "@swc/wasm-web";

export function addPropsSpread(opening: JSXOpeningElement, propName: string = "restProps"): void {
  // Check if props spread already exists
  const hasSpread = opening.attributes.some((attr) => {
    // Check if it's a spread attribute by checking for the arguments property (plural)
    if (attr.type === "SpreadElement" && "arguments" in attr && attr.arguments) {
      const argument = attr.arguments as { type?: string; value?: string };

      if (argument && typeof argument === "object" && argument.type === "Identifier") {
        const existingPropName = (argument as { value?: string }).value?.toLowerCase() || "";
        return existingPropName === propName.toLowerCase() || existingPropName.includes("restProps");
      }
    }
    return false;
  });

  if (!hasSpread) {
    const spreadSpan = createSpan(3);

    const identifier = createIdentifier(propName, 3);

    const spreadAttribute = {
      type: "SpreadElement" as const,
      spread: spreadSpan,
      arguments: identifier,
    };

    opening.attributes.push(spreadAttribute as unknown as (typeof opening.attributes)[0]);
  }
}
