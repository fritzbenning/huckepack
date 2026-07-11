import type { Module } from "@swc/wasm-web";
import { simple } from "swc-walk";

export type CodeClassification = "react" | "html" | "unsupported";

export function classifyCodeFromAST(ast: Module): CodeClassification {
  let hasExport = false;
  let hasFunction = false;
  let hasJSX = false;

  simple(ast, {
    ExportDefaultDeclaration() {
      hasExport = true;
    },
    ExportNamedDeclaration() {
      hasExport = true;
    },
    ExportDeclaration() {
      hasExport = true;
    },
    FunctionDeclaration() {
      hasFunction = true;
    },
    FunctionExpression() {
      hasFunction = true;
    },
    JSXElement() {
      hasJSX = true;
    },
    JSXFragment() {
      hasJSX = true;
    },
  });

  // If it has exports and functions/JSX, it's a React component
  if (hasExport && (hasFunction || hasJSX)) {
    return "react";
  }

  // If it has JSX but no exports, might still be React code
  if (hasJSX) {
    return "react";
  }

  return "unsupported";
}

