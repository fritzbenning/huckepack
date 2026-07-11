import { extractParamsFromVariable } from "@ast/parameter/utils/extractParamsFromVariable";
import { isExportDeclaration, isIdentifier } from "@ast/type-check";
import type { Id } from "@convex/_generated/dataModel";
import type { FormattedParam } from "@project/ast-parser";
import { getParams } from "@project/ast-parser/utils/getParams";
import { getFileAST } from "@project/file-manager/stores/fileManagerStore";
import type {
  ExportDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  Identifier,
  Module,
} from "@swc/wasm-web";
import { simple } from "swc-walk";

export function extractParamsFromAST(ast: Module, fileName: string): Record<string, FormattedParam> {
  const extractedParams: Record<string, FormattedParam> = {};

  simple(ast, {
    ExportDefaultDeclaration(node) {
      const exportNode = node as ExportDefaultDeclaration;

      // Check if export default is an identifier (e.g., export default Button)
      if (exportNode.decl && isIdentifier(exportNode.decl)) {
        const identifier = exportNode.decl as Identifier;
        const params = extractParamsFromVariable(ast, identifier.value);
        Object.assign(extractedParams, params);
        return;
      }

      // Otherwise, use the standard getParams function
      const parsed = getParams(node as ExportDefaultDeclaration, fileName);
      Object.assign(extractedParams, parsed);
    },
    ExportDefaultExpression(node) {
      const exportExpr = node as { expression?: unknown };

      // Check if the expression is an identifier (e.g., export default Button)
      if (exportExpr.expression && isIdentifier(exportExpr.expression)) {
        const identifier = exportExpr.expression as Identifier;
        const params = extractParamsFromVariable(ast, identifier.value);
        Object.assign(extractedParams, params);
      }
    },
    ExportNamedDeclaration(node) {
      const parsed = getParams(node as ExportNamedDeclaration, fileName);
      Object.assign(extractedParams, parsed);
    },
    ExportDeclaration(node) {
      if (isExportDeclaration(node)) {
        const parsed = getParams(node as ExportDeclaration, fileName);
        Object.assign(extractedParams, parsed);
      }
    },
  });

  return extractedParams;
}

export async function getParamsWithFallback(
  fileId: string,
  projectId: string,
  fileName: string,
  paramsFromStore: Record<string, FormattedParam> | null | undefined
): Promise<Record<string, FormattedParam> | null | undefined> {
  // If params exist in store and are not empty, use them
  if (paramsFromStore && Object.keys(paramsFromStore).length > 0) {
    return paramsFromStore;
  }

  // Otherwise, extract from AST
  const ast = await getFileAST(fileId as Id<"files">, projectId as Id<"projects">);
  if (ast) {
    return extractParamsFromAST(ast, fileName);
  }

  return null;
}
