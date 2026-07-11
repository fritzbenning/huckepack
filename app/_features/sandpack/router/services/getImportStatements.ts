import type { ImportDefinition } from "../types";

export const getImportStatements = (imports: ImportDefinition[]) => {
  return imports.map(({ from, what, default: def }) => {
    if (def && what?.length) {
      return `import ${def}, { ${what.join(", ")} } from "${from}";`;
    }
    if (def) {
      return `import ${def} from "${from}";`;
    }
    if (what?.length) {
      return `import { ${what.join(", ")} } from "${from}";`;
    }
    return `import "${from}";`;
  });
};
