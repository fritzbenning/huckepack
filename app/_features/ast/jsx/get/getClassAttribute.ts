import type { Identifier, JSXAttribute, JSXOpeningElement } from "@swc/wasm-web";

export const getClassAttribute = (opening: JSXOpeningElement): JSXAttribute | undefined => {
  return opening.attributes.find((attr) => ((attr as JSXAttribute).name as Identifier).value === "className") as JSXAttribute | undefined;
};
