import { createTransformedAST } from "@ast/utils";
import type { Module } from "@swc/wasm-web";
import { printSync } from "@swc/wasm-web";
import { simple } from "swc-walk";
import type { AugmentedVersionResult } from "../types";
import { type ComponentFunction, handleComponentFunction } from "./handleComponentFunction";
import { identifyComponentFunctions } from "./identifyComponentFunctions";
import { matchReturnStatements } from "./matchReturnStatements";
import { transformJSXElements } from "./transformJSXElements";

export function createAugmentedVersion(
  ast: Module,
  fileSlug: string,
  spanMap: Map<number, string>,
  componentMap?: Map<number, boolean>
): AugmentedVersionResult {
  const transformedAst = createTransformedAST(ast);
  const transformationStart = performance.now();

  // PASS 1: Identify component functions
  const componentFunctionSpans = identifyComponentFunctions(transformedAst, fileSlug);

  // PASS 2: Collect component functions and match return statements
  const componentFunctionsMap = new Map<number, ComponentFunction>();

  simple(transformedAst, {
    FunctionDeclaration(node) {
      const func = node as unknown as Parameters<typeof handleComponentFunction>[0];
      handleComponentFunction(func, componentFunctionSpans, componentFunctionsMap);
    },
    FunctionExpression(node) {
      const func = node as unknown as Parameters<typeof handleComponentFunction>[0];
      handleComponentFunction(func, componentFunctionSpans, componentFunctionsMap);
    },
    ArrowFunctionExpression(node) {
      const func = node as Parameters<typeof handleComponentFunction>[0];
      handleComponentFunction(func, componentFunctionSpans, componentFunctionsMap);
    },
  });

  // Transform JSX elements (onClick removal, data attributes)
  transformJSXElements(transformedAst, spanMap, componentMap);

  // Match return statements to their parent component functions and add restProps spread
  matchReturnStatements(transformedAst, componentFunctionsMap);

  const transformationEnd = performance.now();
  const transformationTime = transformationEnd - transformationStart;

  const formattingStart = performance.now();

  const code = printSync(transformedAst, {
    jsc: {
      target: "es2020",
      parser: {
        syntax: "typescript",
        tsx: true,
      },
    },
  }).code;

  const formattingEnd = performance.now();
  const formattingTime = formattingEnd - formattingStart;

  return {
    code,
    ast: transformedAst,
    timing: {
      transformation: transformationTime,
      formatting: formattingTime,
    },
  };
}
