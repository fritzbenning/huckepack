import { extractFunctionFromForwardRef } from "@ast/parameter/utils/extractFunctionFromForwardRef";
import { getDeclarationFromExport } from "@ast/parameter/utils/getDeclarationFromExport";
import { isCallExpression, isExportDeclaration, isIdentifier } from "@ast/type-check";
import type {
  ArrowFunctionExpression,
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
): FunctionDeclaration | FunctionExpression | ArrowFunctionExpression | undefined {
  const declarator = findVariableDeclaration(ast, variableName);
  if (!declarator || !declarator.init) {
    return undefined;
  }

  const init = declarator.init;

  if (isCallExpression(init)) {
    const forwardRefFunction = extractFunctionFromForwardRef(init);
    if (forwardRefFunction && "params" in forwardRefFunction) {
      return forwardRefFunction;
    }
  }

  if (init.type === "FunctionExpression") {
    if ("params" in init) {
      return init as FunctionExpression;
    }
  }

  if (init.type === "ArrowFunctionExpression") {
    if ("params" in init) {
      return init as ArrowFunctionExpression;
    }
  }

  return undefined;
}

export function identifyComponentFunctions(ast: Module, fileSlug: string): Set<number> {
  const componentFunctionSpans = new Set<number>();

  simple(ast, {
    ExportDefaultDeclaration(node) {
      const exportNode = node as ExportDefaultDeclaration;
      const declaration = getDeclarationFromExport(exportNode);
      if (declaration) {
        componentFunctionSpans.add(declaration.span.start);
      }
    },
    ExportDefaultExpression(node) {
      const exportExpr = node as ExportDefaultExpression;
      if (exportExpr.expression && isIdentifier(exportExpr.expression)) {
        const identifier = exportExpr.expression as Identifier;
        const declaration = getDeclarationFromVariable(ast, identifier.value);
        if (declaration) {
          componentFunctionSpans.add(declaration.span.start);
        }
      }
    },
    ExportNamedDeclaration(node) {
      const exportNode = node as ExportNamedDeclaration;
      const declaration = getDeclarationFromExport(exportNode);
      if (declaration) {
        componentFunctionSpans.add(declaration.span.start);
      }
    },
    ExportDeclaration(node) {
      if (isExportDeclaration(node)) {
        const exportNode = node as ExportDeclaration;
        const declaration = getDeclarationFromExport(exportNode);
        if (declaration) {
          componentFunctionSpans.add(declaration.span.start);
        }
      }
    },
    VariableDeclaration(node) {
      const variable = node as VariableDeclaration;
      if (variable.declarations) {
        for (const declaration of variable.declarations) {
          if (!isIdentifier(declaration.id)) {
            return;
          }
          const declaratorName = declaration.id as Identifier;
          if (declaratorName.value.toLowerCase() === fileSlug.toLowerCase()) {
            if (declaration.init && declaration.init.type === "ArrowFunctionExpression") {
              componentFunctionSpans.add(declaration.init.span.start);
            }
          }
        }
      }
    },
  });

  return componentFunctionSpans;
}

