import type { Module } from "@swc/wasm-web";
import { removeClassToken } from "@ast/utils";
import { getQuasiClassTokens, getQuasiSpacingContext, updateQuasiValue } from "../../utils/quasiValue";
import { traverseTemplateLiteral } from "../../utils/traverseTemplateLiteral";

export function removeValue(ast: Module, nodeStart: number, valueToRemove: string): Module {
  const { ast: transformedAst, found } = traverseTemplateLiteral(ast, nodeStart, (node) => {
    for (let i = 0; i < node.quasis.length; i++) {
      const quasi = node.quasis[i];
      const classTokens = getQuasiClassTokens(quasi);

      if (classTokens.includes(valueToRemove)) {
        const currentValue = quasi.cooked || quasi.raw || "";
        const newValue = removeClassToken(currentValue, valueToRemove);

        const spacingContext = getQuasiSpacingContext(i, node.expressions.length);
        updateQuasiValue(quasi, newValue, spacingContext);
        return true;
      }
    }
    return false;
  });

  if (!found) {
    console.error(`Class "${valueToRemove}" not found in template literal at nodeStart ${nodeStart}`);
  }

  return transformedAst;
}
