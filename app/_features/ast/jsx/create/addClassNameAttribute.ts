import { getSpan } from "@ast/core/get/getSpan";
import { transformAST } from "@ast/utils";
import type { JSXElement, JSXOpeningElement, Module } from "@swc/wasm-web";
import { createJSXAttribute } from "./createJSXAttribute";

// Adds a className attribute to a JSX element if it doesn't already exist
export function addClassNameAttributeToJSXElement(
  ast: Module,
  elementSpanStart: number,
  initialValue: string = ""
): { ast: Module; classNameSpanStart: number | null } {
  let classNameSpanStart: number | null = null;

  const { ast: transformedAst } = transformAST(ast, {
    JSXElement(node: unknown) {
      const jsxElement = node as JSXElement;
      const span = getSpan(jsxElement);
      if (span.start !== elementSpanStart) return false;

      const opening = jsxElement.opening as JSXOpeningElement;

      const hasClassName = opening.attributes.some(
        (attr) => attr.type === "JSXAttribute" && (attr.name as { value: string }).value === "className"
      );

      if (hasClassName) {
        return false;
      }

      const classNameAttr = createJSXAttribute("className", initialValue);
      const classNameSpan = getSpan(classNameAttr.value);
      classNameSpanStart = classNameSpan.start;

      opening.attributes.push(classNameAttr as unknown as (typeof opening.attributes)[0]);
      return false;
    },
  });

  return { ast: transformedAst, classNameSpanStart };
}
