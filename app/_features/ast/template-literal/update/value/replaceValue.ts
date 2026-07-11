import type { Module } from "@swc/wasm-web";
import { replaceClassToken } from "@ast/utils";
import { getQuasiClassTokens, getQuasiSpacingContext, updateQuasiValue } from "../../utils/quasiValue";
import { traverseTemplateLiteral } from "../../utils/traverseTemplateLiteral";

export function replaceValue(ast: Module, nodeStart: number, oldValue: string, newValue: string): Module {
  const { ast: transformedAst, found } = traverseTemplateLiteral(ast, nodeStart, (node) => {
    for (let i = 0; i < node.quasis.length; i++) {
      const quasi = node.quasis[i];
      const classTokens = getQuasiClassTokens(quasi);

      if (classTokens.includes(oldValue)) {
        const currentValue = quasi.cooked || quasi.raw || "";
        const updatedValue = replaceClassToken(currentValue, oldValue, newValue);

        const spacingContext = getQuasiSpacingContext(i, node.expressions.length);
        updateQuasiValue(quasi, updatedValue, spacingContext);
        return true;
      }
    }
    return false;
  });

  if (!found) {
    console.error(`Class "${oldValue}" not found in template literal at nodeStart ${nodeStart}`);
  }

  return transformedAst;
}
