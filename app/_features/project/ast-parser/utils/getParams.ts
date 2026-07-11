import { getSpan } from "@ast/core/get/getSpan";
import { extractFunctionFromForwardRef } from "@ast/parameter/utils/extractFunctionFromForwardRef";
import { isCallExpression, isExportDeclaration } from "@ast/type-check";
import type {
  AssignmentPatternProperty,
  BooleanLiteral,
  ExportDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  FunctionDeclaration,
  FunctionExpression,
  NumericLiteral,
  ObjectPattern,
  StringLiteral,
} from "@swc/wasm-web";
import type { FormattedParam } from "../types";

export const getParams = (
  node: ExportDefaultDeclaration | ExportNamedDeclaration | ExportDeclaration,
  fileName: string
) => {
  const functionName: string | null = null;
  let pattern: ObjectPattern | null = null;
  const formattedParams: Record<string, FormattedParam> = {};

  let declaration: FunctionDeclaration | FunctionExpression | null = null;

  // Handle different export types
  if (isExportDeclaration(node)) {
    // ExportDeclaration: export function Name() {}
    declaration = node.declaration as FunctionDeclaration;
  } else if (node.type === "ExportDefaultDeclaration") {
    // ExportDefaultDeclaration: export default function Name() {}
    const exportNode = node as ExportDefaultDeclaration;
    // Check if decl exists and has identifier property (indicating it's a FunctionDeclaration or FunctionExpression)
    if (exportNode.decl && "identifier" in exportNode.decl && "params" in exportNode.decl) {
      declaration = exportNode.decl as FunctionDeclaration | FunctionExpression;
    } else if (exportNode.decl && isCallExpression(exportNode.decl)) {
      // Handle forwardRef: export default forwardRef(...)
      const forwardRefFunction = extractFunctionFromForwardRef(exportNode.decl);
      if (forwardRefFunction && "params" in forwardRefFunction) {
        declaration = forwardRefFunction as FunctionExpression;
      }
    }
  } else if (node.type === "ExportNamedDeclaration") {
    // ExportNamedDeclaration: export function Name() {}
    const exportNode = node as ExportNamedDeclaration;
    // Check for 'decl' property (for function expressions or forwardRef)
    if ("decl" in exportNode && exportNode.decl && typeof exportNode.decl === "object") {
      // Check if it's a direct function declaration/expression
      if ("identifier" in exportNode.decl && "params" in exportNode.decl) {
        declaration = exportNode.decl as FunctionDeclaration | FunctionExpression;
      } else if (isCallExpression(exportNode.decl)) {
        // Handle forwardRef: export const Name = forwardRef(...)
        const forwardRefFunction = extractFunctionFromForwardRef(exportNode.decl);
        if (forwardRefFunction && "params" in forwardRefFunction) {
          declaration = forwardRefFunction as FunctionExpression;
        }
      }
    }
    // Check for 'declaration' property (for function declarations)
    if (!declaration) {
      const exportNodeWithDecl = exportNode as { declaration?: FunctionDeclaration };
      if (exportNodeWithDecl.declaration) {
        declaration = exportNodeWithDecl.declaration as FunctionDeclaration;
      }
    }
  }

  if (declaration && "params" in declaration) {
    // Process the first exported function we find (since we're working on a specific file AST)
    // For forwardRef, the first param is props, second is ref
    // We want to extract params from the first parameter (props)
    const param = declaration.params[0];
    if (param?.pat?.type === "ObjectPattern") {
      pattern = param.pat as ObjectPattern;

      if (pattern.properties) {
        pattern.properties.forEach((param) => {
          if (param.type === "RestElement" || !("key" in param) || !param.key) {
            return;
          }

          const assignmentParam = param as AssignmentPatternProperty;
          const value = assignmentParam.value as StringLiteral | NumericLiteral | BooleanLiteral;
          const type = value?.type ?? "unknown";
          const defaultValue = value?.value ?? null;
          const span = value ? getSpan(value) : undefined;

          if (assignmentParam.key && "value" in assignmentParam.key) {
            formattedParams[assignmentParam.key.value] = {
              type,
              defaultValue,
              span,
            };
          }
        });
      }
    }
  }

  return formattedParams || [];
};
