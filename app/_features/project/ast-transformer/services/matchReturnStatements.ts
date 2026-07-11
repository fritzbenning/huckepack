import { addPropsSpread, getRootJSXElement, hasPropsSpread } from "@ast/jsx";
import { getRestParameterName } from "@ast/parameter";
import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import type { JSXOpeningElement } from "./createAugmentedVersion.types.d";
import type { ComponentFunction } from "./handleComponentFunction";

export function matchReturnStatements(ast: Module, componentFunctionsMap: Map<number, ComponentFunction>): void {
  const returnStatementsWithJSX: Array<{
    returnNode: { span: { start: number; end: number } };
    rootJSX: JSXOpeningElement;
  }> = [];

  simple(ast, {
    ReturnStatement(returnNode) {
      if (!returnNode?.argument) return;

      const rootElement = getRootJSXElement(returnNode.argument as unknown as Parameters<typeof getRootJSXElement>[0]);
      if (!rootElement) return;

      returnStatementsWithJSX.push({
        returnNode: returnNode as { span: { start: number; end: number } },
        rootJSX: rootElement.opening as unknown as JSXOpeningElement,
      });
    },
  });

  // Match return statements to their parent component functions
  for (const returnData of returnStatementsWithJSX) {
    for (const [_spanStart, func] of componentFunctionsMap.entries()) {
      // Check if this return statement is within this function's span range
      if (returnData.returnNode.span.start >= func.span.start && returnData.returnNode.span.end <= func.span.end) {
        if (!hasPropsSpread(returnData.rootJSX)) {
          const restParamName = getRestParameterName(func) || "restProps";
          addPropsSpread(returnData.rootJSX, restParamName);
        }
        break;
      }
    }
  }
}
