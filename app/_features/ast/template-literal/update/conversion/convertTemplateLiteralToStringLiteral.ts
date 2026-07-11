import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import { getClassAttribute } from "@ast/jsx/get/getClassAttribute";
import { getSpan } from "@ast/core/get/getSpan";
import { isJSXExpressionContainer, isTemplateLiteral } from "@ast/type-check";
import type { JSXAttribute, JSXOpeningElement, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { createTransformedAST } from "@ast/utils";

export function convertTemplateLiteralToStringLiteral(ast: Module, templateSpanStart: number): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  simple(transformedAst, {
    JSXOpeningElement(node) {
      if (found) return;

      const classAttribute = getClassAttribute(node as unknown as JSXOpeningElement);
      if (!classAttribute) return;

      // Check if the attribute value is a JSX expression container with a template literal
      if (classAttribute.value && isJSXExpressionContainer(classAttribute.value)) {
        const expression = classAttribute.value.expression;

        if (isTemplateLiteral(expression)) {
          const templateSpan = getSpan(expression);

          // Match by template literal span start
          if (templateSpan.start !== templateSpanStart) return;

          // Check if there are no expressions (only static quasis remain)
          if (expression.expressions.length === 0) {
            // Combine all quasis into a single string
            // Normalize whitespace but preserve class content
            const combinedValue = expression.quasis
              .map((quasi) => quasi.cooked || quasi.raw || "")
              .join("")
              .replace(/\s+/g, " ") // Normalize multiple spaces to single space
              .trim();

            // Create a string literal with the combined value
            const stringLiteral = createStringLiteral(combinedValue);

            // Replace the JSX expression container with the string literal
            (classAttribute as JSXAttribute).value = stringLiteral;

            found = true;
            return;
          }
        }
      }
    },
  });

  if (!found) {
    console.error(`Template literal not found at span start ${templateSpanStart} or still has expressions`);
  }

  return transformedAst;
}
