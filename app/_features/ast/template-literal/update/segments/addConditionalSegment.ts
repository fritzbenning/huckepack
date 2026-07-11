import { getSpan } from "@ast/core/get/getSpan";
import { createBinaryExpression } from "@ast/expression/create/createBinaryExpression";
import { createExpressionFromValue } from "@ast/expression/create/createExpressionFromValue";
import { createUnaryExpression } from "@ast/expression/create/createUnaryExpression";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import { isTemplateLiteral } from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type { BinaryExpression, ConditionalExpression, Module, TemplateElement } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { getQuasiSpacingContext, getQuasiValue, updateQuasiValue } from "../../utils/quasiValue";
import { convertStringLiteralToTemplateLiteral } from "../conversion/convertStringLiteralToTemplateLiteral";

export function addConditionalSegment(
  ast: Module,
  nodeStart: number,
  property: string,
  operator: string,
  testValue: string | number | boolean
): Module {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  // Check if this is an "is defined" or "is undefined" check
  const isDefinedCheck = operator === "&&" && testValue === "";
  const isUndefinedCheck = operator === "!&&" && testValue === "";

  // First, try to find a template literal
  simple(transformedAst, {
    TemplateLiteral(node) {
      if (found || !isTemplateLiteral(node)) return;

      const templateSpan = getSpan(node);
      if (templateSpan.start === nodeStart) {
        const leftExpr = createIdentifier(property, 3);

        // For "is defined" or "is undefined" checks, create a logical-and expression
        if (isDefinedCheck || isUndefinedCheck) {
          const testExpr = isUndefinedCheck
            ? createUnaryExpression(leftExpr, "!", templateSpan.start, templateSpan.end)
            : leftExpr;
          const emptyStringLiteral = createStringLiteral("");
          const binaryExpr: BinaryExpression = createBinaryExpression(
            testExpr,
            "&&",
            emptyStringLiteral,
            templateSpan.end,
            templateSpan.end + property.length + (isUndefinedCheck ? 5 : 4)
          );

          const lastQuasiIndex = node.quasis.length - 1;
          if (lastQuasiIndex >= 0) {
            node.quasis[lastQuasiIndex].tail = false;

            const lastQuasi = node.quasis[lastQuasiIndex];
            // Ensure the last quasi has proper spacing using normalization
            const lastQuasiValue = getQuasiValue(lastQuasi);
            const spacingContext = getQuasiSpacingContext(lastQuasiIndex, node.expressions.length);
            // Update with hasFollowingExpression=true since we're adding a new expression after this quasi
            updateQuasiValue(lastQuasi, lastQuasiValue, {
              ...spacingContext,
              hasFollowingExpression: true,
            });

            const newQuasi: TemplateElement = {
              type: "TemplateElement",
              span: {
                start: templateSpan.end,
                end: templateSpan.end + 1,
                ctxt: lastQuasi.span.ctxt ?? 0,
              },
              tail: true,
              cooked: " ",
              raw: " ",
            };

            node.quasis.push(newQuasi);
            node.expressions.push(binaryExpr);
          } else {
            const newQuasi: TemplateElement = {
              type: "TemplateElement",
              span: {
                start: templateSpan.start,
                end: templateSpan.start + 1,
                ctxt: 0,
              },
              tail: true,
              cooked: " ",
              raw: " ",
            };

            node.quasis.push(newQuasi);
            node.expressions.push(binaryExpr);
          }
        } else {
          // For regular conditions, create a conditional expression
          const rightExpr = createExpressionFromValue(testValue);
          const testExpr = createBinaryExpression(leftExpr, operator, rightExpr, templateSpan.start, templateSpan.end);

          const consequent = createStringLiteral("");
          const alternate = createStringLiteral("");
          const conditionalExpr: ConditionalExpression = {
            type: "ConditionalExpression",
            span: {
              start: templateSpan.end,
              end: templateSpan.end + 50,
              ctxt: 0,
            },
            test: testExpr,
            consequent,
            alternate,
          };

          const lastQuasiIndex = node.quasis.length - 1;
          if (lastQuasiIndex >= 0) {
            node.quasis[lastQuasiIndex].tail = false;

            const lastQuasi = node.quasis[lastQuasiIndex];
            // Ensure the last quasi has proper spacing using normalization
            const lastQuasiValue = getQuasiValue(lastQuasi);
            const spacingContext = getQuasiSpacingContext(lastQuasiIndex, node.expressions.length);
            // Update with hasFollowingExpression=true since we're adding a new expression after this quasi
            updateQuasiValue(lastQuasi, lastQuasiValue, {
              ...spacingContext,
              hasFollowingExpression: true,
            });

            const newQuasi: TemplateElement = {
              type: "TemplateElement",
              span: {
                start: templateSpan.end,
                end: templateSpan.end + 1,
                ctxt: lastQuasi.span.ctxt ?? 0,
              },
              tail: true,
              cooked: " ",
              raw: " ",
            };

            node.quasis.push(newQuasi);
            node.expressions.push(conditionalExpr);
          } else {
            const newQuasi: TemplateElement = {
              type: "TemplateElement",
              span: {
                start: templateSpan.start,
                end: templateSpan.start + 1,
                ctxt: 0,
              },
              tail: true,
              cooked: " ",
              raw: " ",
            };

            node.quasis.push(newQuasi);
            node.expressions.push(conditionalExpr);
          }
        }

        found = true;
        return;
      }
    },
  });

  if (!found) {
    const convertedAst = convertStringLiteralToTemplateLiteral(
      transformedAst,
      nodeStart,
      property,
      operator,
      testValue
    );
    return convertedAst;
  }

  return transformedAst;
}
