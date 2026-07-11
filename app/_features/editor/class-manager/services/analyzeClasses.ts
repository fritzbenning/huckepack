import { getClassAttribute } from "@ast/jsx/get";
import { isJSXExpressionContainer, isStringLiteral } from "@ast/type-check";
import type { JSXOpeningElement } from "@swc/wasm-web";
import type { StringLiteralClasses, TemplateLiteralClasses } from "../types";
import { processJSXExpressionContainer } from "../utils/processJSXExpressionContainer";
import { processStringLiteral } from "../utils/string-literal/processStringLiteral";

export const analyzeClasses = (opening: JSXOpeningElement): StringLiteralClasses | TemplateLiteralClasses | null => {
  const classAttribute = getClassAttribute(opening);

  const classes = classAttribute?.value;

  if (classes) {
    if (isStringLiteral(classes)) {
      return processStringLiteral(classes);
    }

    if (isJSXExpressionContainer(classes)) {
      return processJSXExpressionContainer(classes);
    }
  }

  return null;
};
