import {
  addDataInstanceAttribute,
  addDataInstanceNameAttribute,
  addDataNodeIdAttribute,
  getComponentNameFromOpening,
} from "@ast/jsx";
import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import type { JSXOpeningElement } from "./createAugmentedVersion.types.d";

export function transformJSXElements(
  ast: Module,
  spanMap: Map<number, string>,
  componentMap?: Map<number, boolean>
): void {
  simple(ast, {
    JSXElement(node) {
      const opening = node.opening as unknown as JSXOpeningElement;

      // Remove all onClick attributes
      opening.attributes = opening.attributes.filter(
        (attr) => !(attr.type === "JSXAttribute" && attr.name.type === "Identifier" && attr.name.value === "onClick")
      );

      const nodeId = spanMap.get(node.span.start);
      if (!nodeId) return;

      addDataNodeIdAttribute(opening as unknown as Parameters<typeof addDataNodeIdAttribute>[0], nodeId);

      if (componentMap?.get(node.span.start) === true) {
        addDataInstanceAttribute(opening as unknown as Parameters<typeof addDataInstanceAttribute>[0]);

        const componentName = getComponentNameFromOpening(
          opening as unknown as Parameters<typeof getComponentNameFromOpening>[0]
        );
        if (componentName) {
          addDataInstanceNameAttribute(
            opening as unknown as Parameters<typeof addDataInstanceNameAttribute>[0],
            componentName
          );
        }
      }
    },
  });
}
