import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import type { ImportDeclaration, ImportSpecifier, Module } from "@swc/wasm-web";
import { createImportStatement } from "../create/createImportStatement";

export function ensureReactNodeImport(ast: Module): Module {
  const transformedAst = { ...ast, body: [...ast.body] };

  // Find any import from "react"
  let reactImport: ImportDeclaration | null = null;
  let reactImportIndex = -1;

  for (let i = 0; i < transformedAst.body.length; i++) {
    const item = transformedAst.body[i];
    if (item.type === "ImportDeclaration") {
      const importDecl = item as ImportDeclaration;
      if (importDecl.source.value === "react") {
        reactImport = importDecl;
        reactImportIndex = i;
        break;
      }
    }
  }

  if (reactImport) {
    // Check if ReactNode is already imported
    const hasReactNode = reactImport.specifiers.some((spec) => {
      if (spec.type === "ImportSpecifier") {
        const importedName = spec.imported?.value || spec.local.value;
        return importedName === "ReactNode" || spec.local.value === "ReactNode";
      }
      return false;
    });

    if (!hasReactNode) {
      // Add ReactNode to the existing React import
      const reactNodeSpecifier: ImportSpecifier = {
        type: "ImportSpecifier",
        span: createSpan(9), // "ReactNode".length
        local: createIdentifier("ReactNode", 2),
        imported: undefined,
        isTypeOnly: true,
      };

      reactImport.specifiers = [...reactImport.specifiers, reactNodeSpecifier];
      transformedAst.body[reactImportIndex] = reactImport;
    }
  } else {
    // Create a new import for React with ReactNode
    const reactImportStatement = createImportStatement({
      specifiers: [{ name: "ReactNode", isTypeOnly: true }],
      source: "react",
      typeOnly: false,
    });

    // Find the last import declaration to insert after it
    let lastImportIndex = -1;
    for (let i = 0; i < transformedAst.body.length; i++) {
      if (transformedAst.body[i].type === "ImportDeclaration") {
        lastImportIndex = i;
      }
    }

    // Insert import after last import or at the beginning
    const insertIndex = lastImportIndex + 1;
    transformedAst.body.splice(insertIndex, 0, reactImportStatement as (typeof transformedAst.body)[0]);
  }

  return transformedAst;
}
