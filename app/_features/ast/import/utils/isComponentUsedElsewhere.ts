import type { JSXElement, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { getComponentName } from "./getComponentName";

export function isComponentUsedElsewhere(ast: Module, componentName: string): boolean {
  let foundUsage = false;

  simple(ast, {
    JSXElement(node) {
      const name = getComponentName(node as JSXElement);
      if (name === componentName) {
        foundUsage = true;
      }
    },
  });

  return foundUsage;
}
