import { isIdentifier, isTemplateLiteral } from "@ast/type-check";
import type { JSXExpressionContainer } from "@swc/wasm-web";
import type { TemplateLiteralClasses } from "../types";
import { processTemplateLiteral } from "./template-literal/processTemplateLiteral";

export const processJSXExpressionContainer = (container: JSXExpressionContainer): TemplateLiteralClasses | null => {
  const expression = container.expression;

  if (isIdentifier(expression)) {
    return null;
  }

  if (isTemplateLiteral(expression)) {
    return processTemplateLiteral(expression);
  }

  return null;
};
