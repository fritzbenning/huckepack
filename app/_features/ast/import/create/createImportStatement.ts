import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createStringLiteral } from "@ast/string-literal/create/createStringLiteral";
import type { ImportDeclaration } from "@swc/wasm-web";

interface ImportSpecifierConfig {
  name: string;
  alias?: string;
  isTypeOnly?: boolean;
}

interface CreateImportStatementOptions {
  specifiers: ImportSpecifierConfig[];
  source: string;
  typeOnly?: boolean;
}

export function createImportStatement(options: CreateImportStatementOptions): ImportDeclaration {
  const { specifiers, source, typeOnly = false } = options;

  const astSpecifiers = specifiers.map((spec) => {
    const localName = spec.alias || spec.name;
    const importedName = spec.alias ? spec.name : null;

    return {
      type: "ImportSpecifier" as const,
      span: createSpan(localName.length),
      local: createIdentifier(localName, 2),
      imported: importedName ? createIdentifier(importedName, 0) : undefined,
      isTypeOnly: spec.isTypeOnly || false,
    };
  });

  const importDeclaration: ImportDeclaration = {
    type: "ImportDeclaration",
    span: createSpan(50), // Approximate import statement length
    specifiers: astSpecifiers,
    source: createStringLiteral(source),
    typeOnly,
  };

  return importDeclaration;
}
