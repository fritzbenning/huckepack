import { convertToAST } from "@ast/convert";
import { getDeclarationFromExport } from "@ast/parameter/utils/getDeclarationFromExport";
import { isExportDeclaration, isIdentifier } from "@ast/type-check";
import type {
  ExportDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  FunctionDeclaration,
  FunctionExpression,
  Module,
  VariableDeclarator,
} from "@swc/wasm-web";
import { simple } from "swc-walk";

export async function extractComponentName(code: string): Promise<string | null> {
  try {
    const ast = await convertToAST(code);
    return extractComponentNameFromAST(ast);
  } catch (error) {
    console.error("Failed to extract component name:", error);
    return null;
  }
}

export function extractComponentNameFromAST(ast: Module): string | null {
  let componentName: string | null = null;

  simple(ast, {
    ExportDefaultDeclaration(node) {
      const exportNode = node as ExportDefaultDeclaration;

      // Check if it's a variable declaration (e.g., export default const Component = ...)
      // Use type assertion to check for VariableDeclaration
      const decl = exportNode.decl as unknown;
      if (decl && typeof decl === "object" && "type" in decl && decl.type === "VariableDeclaration") {
        const varDecl = decl as { declarations?: VariableDeclarator[] };
        if (varDecl.declarations && varDecl.declarations.length > 0) {
          const declarator = varDecl.declarations[0] as VariableDeclarator;
          if (declarator.id && declarator.id.type === "Identifier") {
            componentName = declarator.id.value;
            return;
          }
        }
      }

      // Check for function declarations/expressions
      const declaration = getDeclarationFromExport(exportNode);
      if (declaration) {
        const name = getFunctionName(declaration);
        if (name) {
          componentName = name;
        }
      }
    },
    ExportNamedDeclaration(node) {
      const exportNode = node as ExportNamedDeclaration;

      // Check if it's a variable declaration (e.g., export const Component = ...)
      // Use type assertion to access declaration property
      const exportNodeWithDecl = exportNode as { declaration?: { type?: string; declarations?: VariableDeclarator[] } };
      if (exportNodeWithDecl.declaration && exportNodeWithDecl.declaration.type === "VariableDeclaration") {
        const varDecl = exportNodeWithDecl.declaration as { declarations?: VariableDeclarator[] };
        if (varDecl.declarations && varDecl.declarations.length > 0) {
          const declarator = varDecl.declarations[0] as VariableDeclarator;
          if (declarator.id && declarator.id.type === "Identifier") {
            componentName = declarator.id.value;
            return;
          }
        }
      }

      // Check for function declarations/expressions
      const declaration = getDeclarationFromExport(exportNode);
      if (declaration) {
        const name = getFunctionName(declaration);
        if (name) {
          componentName = name;
        }
      }
    },
    ExportDeclaration(node) {
      if (isExportDeclaration(node)) {
        const declaration = getDeclarationFromExport(node as ExportDeclaration);
        if (declaration) {
          const name = getFunctionName(declaration);
          if (name) {
            componentName = name;
          }
        }
      }
    },
  });

  return componentName;
}

/**
 * Gets the function name from a function declaration or expression
 */
function getFunctionName(declaration: FunctionDeclaration | FunctionExpression): string | null {
  if ("identifier" in declaration && declaration.identifier) {
    if (isIdentifier(declaration.identifier)) {
      return declaration.identifier.value;
    }
  }
  return null;
}
