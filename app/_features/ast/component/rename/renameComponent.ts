import { getComponentName } from "@ast/import/utils/getComponentName";
import { getDeclarationFromExport } from "@ast/parameter/utils/getDeclarationFromExport";
import { isExportDeclaration, isIdentifier } from "@ast/type-check";
import { createTransformedAST } from "@ast/utils";
import type {
  ExportDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  FunctionDeclaration,
  FunctionExpression,
  JSXClosingElement,
  JSXElement,
  JSXMemberExpression,
  JSXOpeningElement,
  Module,
  VariableDeclarator,
} from "@swc/wasm-web";
import { simple } from "swc-walk";

export function renameComponent(ast: Module, oldComponentName: string, newComponentName: string): Module | null {
  if (oldComponentName === newComponentName) {
    return ast;
  }

  const transformedAst = createTransformedAST(ast);
  let found = false;

  // Gets the function name from a function declaration or expression
  const getFunctionName = (declaration: FunctionDeclaration | FunctionExpression): string | null => {
    if ("identifier" in declaration && declaration.identifier) {
      if (isIdentifier(declaration.identifier)) {
        return declaration.identifier.value;
      }
    }
    return null;
  };

  // Renames a function identifier
  const renameFunctionIdentifier = (declaration: FunctionDeclaration | FunctionExpression): boolean => {
    const name = getFunctionName(declaration);
    if (name === oldComponentName && declaration.identifier && isIdentifier(declaration.identifier)) {
      declaration.identifier.value = newComponentName;
      return true;
    }
    return false;
  };

  // Renames a variable declarator identifier
  const renameVariableIdentifier = (declarator: VariableDeclarator): boolean => {
    if (declarator.id && declarator.id.type === "Identifier" && declarator.id.value === oldComponentName) {
      declarator.id.value = newComponentName;
      return true;
    }
    return false;
  };

  // First pass: Rename component declarations in exports
  simple(transformedAst, {
    ExportDefaultDeclaration(node) {
      if (found) return;
      const exportNode = node as ExportDefaultDeclaration;

      // Check if it's a variable declaration (e.g., export default const Component = ...)
      const decl = exportNode.decl as unknown;
      if (decl && typeof decl === "object" && "type" in decl && decl.type === "VariableDeclaration") {
        const varDecl = decl as { declarations?: VariableDeclarator[] };
        if (varDecl.declarations && varDecl.declarations.length > 0) {
          const declarator = varDecl.declarations[0] as VariableDeclarator;
          if (renameVariableIdentifier(declarator)) {
            found = true;
            return;
          }
        }
      }

      // Check for function declarations/expressions
      const declaration = getDeclarationFromExport(exportNode);
      if (declaration && renameFunctionIdentifier(declaration)) {
        found = true;
      }
    },

    ExportNamedDeclaration(node) {
      if (found) return;
      const exportNode = node as ExportNamedDeclaration;

      // Check if it's a variable declaration (e.g., export const Component = ...)
      const exportNodeWithDecl = exportNode as { declaration?: { type?: string; declarations?: VariableDeclarator[] } };
      if (exportNodeWithDecl.declaration && exportNodeWithDecl.declaration.type === "VariableDeclaration") {
        const varDecl = exportNodeWithDecl.declaration as { declarations?: VariableDeclarator[] };
        if (varDecl.declarations && varDecl.declarations.length > 0) {
          const declarator = varDecl.declarations[0] as VariableDeclarator;
          if (renameVariableIdentifier(declarator)) {
            found = true;
            return;
          }
        }
      }

      // Check for function declarations/expressions
      const declaration = getDeclarationFromExport(exportNode);
      if (declaration && renameFunctionIdentifier(declaration)) {
        found = true;
      }
    },

    ExportDeclaration(node) {
      if (found) return;
      if (isExportDeclaration(node)) {
        const declaration = getDeclarationFromExport(node as ExportDeclaration);
        if (declaration && renameFunctionIdentifier(declaration)) {
          found = true;
        }
      }
    },
  });

  // Second pass: Rename JSX references to the component
  simple(transformedAst, {
    JSXElement(node) {
      const jsxElement = node as JSXElement;
      const componentName = getComponentName(jsxElement);

      if (componentName === oldComponentName) {
        // Rename in opening element
        const opening = jsxElement.opening as JSXOpeningElement;
        if (opening.name) {
          if (opening.name.type === "Identifier") {
            opening.name.value = newComponentName;
            found = true;
          } else if (opening.name.type === "JSXMemberExpression") {
            // Handle JSXMemberExpression like <Component.SubComponent />
            const memberExpr = opening.name as JSXMemberExpression;
            if (
              memberExpr.object &&
              memberExpr.object.type === "Identifier" &&
              memberExpr.object.value === oldComponentName
            ) {
              memberExpr.object.value = newComponentName;
              found = true;
            }
          }
        }

        // Rename in closing element if it exists
        if (jsxElement.closing) {
          const closing = jsxElement.closing as JSXClosingElement;
          if (closing.name) {
            if (closing.name.type === "Identifier") {
              closing.name.value = newComponentName;
            } else if (closing.name.type === "JSXMemberExpression") {
              // Handle JSXMemberExpression in closing tag
              const memberExpr = closing.name as JSXMemberExpression;
              if (
                memberExpr.object &&
                memberExpr.object.type === "Identifier" &&
                memberExpr.object.value === oldComponentName
              ) {
                memberExpr.object.value = newComponentName;
              }
            }
          }
        }
      }
    },
  });

  return found ? transformedAst : null;
}
