import { extractFunctionFromForwardRef } from "@ast/parameter/utils/extractFunctionFromForwardRef";
import { isCallExpression, isIdentifier } from "@ast/type-check";
import type {
  ExportDeclaration,
  ExportDefaultDeclaration,
  ExportDefaultExpression,
  ExportNamedDeclaration,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  Module,
  VariableDeclaration,
  VariableDeclarator,
} from "@swc/wasm-web";
import { simple } from "swc-walk";
import { getDeclarationFromExport } from "../../parameter/utils/getDeclarationFromExport";
import { createTransformedAST } from "./createTransformedAST";

function findVariableDeclaration(ast: Module, variableName: string): VariableDeclarator | undefined {
  for (const item of ast.body) {
    if (item.type === "VariableDeclaration") {
      const varDecl = item as VariableDeclaration;
      if (varDecl.declarations) {
        for (const declarator of varDecl.declarations) {
          if (declarator.id && declarator.id.type === "Identifier" && declarator.id.value === variableName) {
            return declarator;
          }
        }
      }
    }
  }
  return undefined;
}

function getDeclarationFromVariable(
  ast: Module,
  variableName: string
): FunctionDeclaration | FunctionExpression | undefined {
  const declarator = findVariableDeclaration(ast, variableName);
  if (!declarator || !declarator.init) {
    return undefined;
  }

  const init = declarator.init;

  // Check if it's a forwardRef call
  if (isCallExpression(init)) {
    const forwardRefFunction = extractFunctionFromForwardRef(init);
    if (forwardRefFunction && "params" in forwardRefFunction) {
      return forwardRefFunction;
    }
  }

  // Check if it's a direct function expression
  if (init.type === "FunctionExpression" || init.type === "ArrowFunctionExpression") {
    if ("params" in init) {
      return init as FunctionExpression;
    }
  }

  return undefined;
}

// Traverses export declarations and calls handler for each declaration found
export function traverseExports(
  ast: Module,
  handler: (declaration: FunctionDeclaration | FunctionExpression) => boolean
): { ast: Module; found: boolean } {
  const transformedAst = createTransformedAST(ast);
  let found = false;

  const processExport = (node: ExportDefaultDeclaration | ExportNamedDeclaration | ExportDeclaration): void => {
    if (found) return;
    const declaration = getDeclarationFromExport(node);
    if (declaration && handler(declaration)) {
      found = true;
    }
  };

  simple(transformedAst, {
    ExportDefaultDeclaration(node: unknown) {
      processExport(node as ExportDefaultDeclaration);
    },
    ExportDefaultExpression(node: unknown) {
      if (found) return;
      const exportExpr = node as ExportDefaultExpression;
      // Check if export default is an identifier (e.g., export default Button)
      if (exportExpr.expression && isIdentifier(exportExpr.expression)) {
        const identifier = exportExpr.expression as Identifier;
        const declaration = getDeclarationFromVariable(transformedAst, identifier.value);
        if (declaration && handler(declaration)) {
          found = true;
        }
      }
    },
    ExportNamedDeclaration(node: unknown) {
      processExport(node as ExportNamedDeclaration);
    },
    ExportDeclaration(node: unknown) {
      processExport(node as ExportDeclaration);
    },
  });

  return { ast: transformedAst, found };
}
