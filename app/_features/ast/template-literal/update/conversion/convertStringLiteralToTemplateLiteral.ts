import { getSpan } from "@ast/core/get/getSpan";
import { createBinaryExpression } from "@ast/expression/create/createBinaryExpression";
import { createExpressionFromValue } from "@ast/expression/create/createExpressionFromValue";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createJSXExpressionContainer } from "@ast/jsx/create/createJSXExpressionContainer";
import { getClassAttribute } from "@ast/jsx/get/getClassAttribute";
import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import { isStringLiteral } from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type {
  ConditionalExpression,
  JSXAttribute,
  JSXOpeningElement,
  Module,
  TemplateElement,
  TemplateLiteral,
} from "@swc/wasm-web";
import { simple } from "swc-walk";

export function convertStringLiteralToTemplateLiteral(
  ast: Module,
  nodeStart: number,
  property: string,
  operator: string,
  testValue: string | number | boolean
): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  simple(transformedAst, {
    JSXOpeningElement(node) {
      if (found) return;

      const classAttribute = getClassAttribute(node as unknown as JSXOpeningElement);
      if (!classAttribute) return;

      if (classAttribute.value && isStringLiteral(classAttribute.value)) {
        const stringLiteral = classAttribute.value;
        const stringSpan = getSpan(stringLiteral);

        if (stringSpan.start !== nodeStart) return;

        const stringValue = stringLiteral.value;

        const leftExpr = createIdentifier(property, 3);
        const rightExpr = createExpressionFromValue(testValue);
        const testExpr = createBinaryExpression(leftExpr, operator, rightExpr, stringSpan.start, stringSpan.end);

        const consequent = createStringLiteral("");
        const alternate = createStringLiteral("");

        const conditionalStart = stringSpan.end;
        const conditionalEnd = conditionalStart + 50;

        const conditionalExpr: ConditionalExpression = {
          type: "ConditionalExpression",
          span: {
            start: conditionalStart,
            end: conditionalEnd,
            ctxt: 0,
          },
          test: testExpr,
          consequent,
          alternate,
        };

        const firstQuasiValue = stringValue ? `${stringValue} ` : " ";
        const firstQuasiEnd = stringSpan.start + firstQuasiValue.length;

        const firstQuasi: TemplateElement = {
          type: "TemplateElement",
          span: {
            start: stringSpan.start,
            end: firstQuasiEnd,
            ctxt: stringSpan.ctxt ?? 0,
          },
          tail: false,
          cooked: firstQuasiValue,
          raw: firstQuasiValue,
        };

        const secondQuasiStart = conditionalEnd;
        const secondQuasi: TemplateElement = {
          type: "TemplateElement",
          span: {
            start: secondQuasiStart,
            end: secondQuasiStart + 1,
            ctxt: stringSpan.ctxt ?? 0,
          },
          tail: true,
          cooked: "",
          raw: "",
        };

        const templateLiteral: TemplateLiteral = {
          type: "TemplateLiteral",
          span: {
            start: stringSpan.start,
            end: secondQuasiStart + 1,
            ctxt: stringSpan.ctxt ?? 0,
          },
          quasis: [firstQuasi, secondQuasi],
          expressions: [conditionalExpr],
        };

        (classAttribute as JSXAttribute).value = createJSXExpressionContainer(templateLiteral);

        found = true;
        return;
      }
    },
  });

  if (!found) {
    console.error(`String literal class attribute not found at nodeStart ${nodeStart}`);
  }

  return transformedAst;
}
