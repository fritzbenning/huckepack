import { isCallExpression, isExportDeclaration } from "@ast/type-check";
import type {
  ExportDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  FunctionDeclaration,
  FunctionExpression,
} from "@swc/wasm-web";
import { extractFunctionFromForwardRef } from "./extractFunctionFromForwardRef";

export function getDeclarationFromExport(
  node: ExportDefaultDeclaration | ExportNamedDeclaration | ExportDeclaration | unknown
): FunctionDeclaration | FunctionExpression | undefined {
  // Handle ExportDefaultDeclaration: export default function Name() {}
  if ((node as ExportDefaultDeclaration).type === "ExportDefaultDeclaration") {
    const exportNode = node as ExportDefaultDeclaration;

    // Check if it's a direct function declaration/expression
    if (exportNode.decl && "identifier" in exportNode.decl && "params" in exportNode.decl) {
      return exportNode.decl as FunctionDeclaration | FunctionExpression;
    }

    // Check if it's a forwardRef call: export default forwardRef(...)
    if (exportNode.decl && isCallExpression(exportNode.decl)) {
      const forwardRefFunction = extractFunctionFromForwardRef(exportNode.decl);
      if (forwardRefFunction && "params" in forwardRefFunction) {
        return forwardRefFunction as FunctionExpression;
      }
    }
  }

  // Handle ExportNamedDeclaration: export function Name() {}
  if ((node as ExportNamedDeclaration).type === "ExportNamedDeclaration") {
    const exportNode = node as ExportNamedDeclaration;
    // ExportNamedDeclaration can have 'decl' or 'declaration' property depending on the structure
    // Check for 'decl' first (for function expressions)
    if ("decl" in exportNode && exportNode.decl && typeof exportNode.decl === "object") {
      // Check if it's a direct function declaration/expression
      if ("identifier" in exportNode.decl && "params" in exportNode.decl) {
        return exportNode.decl as FunctionDeclaration | FunctionExpression;
      }

      // Check if it's a forwardRef call: export const Name = forwardRef(...)
      if (isCallExpression(exportNode.decl)) {
        const forwardRefFunction = extractFunctionFromForwardRef(exportNode.decl);
        if (forwardRefFunction && "params" in forwardRefFunction) {
          return forwardRefFunction as FunctionExpression;
        }
      }
    }
    // Check for 'declaration' property (for function declarations)
    const exportNodeWithDecl = exportNode as { declaration?: FunctionDeclaration };
    if (exportNodeWithDecl.declaration) {
      return exportNodeWithDecl.declaration as FunctionDeclaration;
    }
  }

  // Handle ExportDeclaration: export function Name() {}
  if (isExportDeclaration(node)) {
    const exportNode = node as ExportDeclaration;
    if (exportNode.declaration) {
      return exportNode.declaration as FunctionDeclaration;
    }
  }

  return undefined;
}
