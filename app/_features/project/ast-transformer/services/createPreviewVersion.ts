import { createImportStatement } from "@ast/import";
import { createTransformedAST } from "@ast/utils";
import type { Module } from "@swc/wasm-web";
import { printSync } from "@swc/wasm-web";
import type { PreviewVersionResult } from "../types";
import { wrapReturnStatement } from "./wrapReturnStatement";

export type { PreviewVersionResult };

export function createPreviewVersion(ast: Module): PreviewVersionResult {
  const transformedAst = createTransformedAST(ast);

  // Add the PreviewWrapper import at the beginning
  const previewWrapperImport = createImportStatement({
    specifiers: [{ name: "PreviewWrapper" }],
    source: "./toolkit/PreviewWrapper.tsx",
  });

  transformedAst.body.unshift(previewWrapperImport);

  // Wrap the first return statement in PreviewWrapper
  wrapReturnStatement(transformedAst);

  const code = printSync(transformedAst, {
    jsc: {
      target: "es2020",
      parser: {
        syntax: "typescript",
        tsx: true,
      },
    },
  }).code;

  return {
    code,
    ast: transformedAst,
  };
}
