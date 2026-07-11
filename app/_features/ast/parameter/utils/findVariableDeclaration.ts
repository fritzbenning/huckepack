import type { Module, VariableDeclaration, VariableDeclarator } from "@swc/wasm-web";

export function findVariableDeclaration(ast: Module, variableName: string): VariableDeclarator | undefined {
  for (const item of ast.body) {
    if (item.type === "VariableDeclaration") {
      const varDecl = item as VariableDeclaration;
      if (varDecl.declarations) {
        for (const declarator of varDecl.declarations) {
          if (declarator.id && declarator.id.type === "Identifier") {
            if (declarator.id.value === variableName) {
              return declarator;
            }
          }
        }
      }
    }
  }
  return undefined;
}
