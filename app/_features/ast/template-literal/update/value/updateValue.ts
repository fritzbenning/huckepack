import { updateClassTokens } from "@ast/utils";
import type { Module } from "@swc/wasm-web";
import { findTargetQuasi, getQuasiSpacingContext, getQuasiValue, updateQuasiValue } from "../../utils/quasiValue";
import { traverseTemplateLiteral } from "../../utils/traverseTemplateLiteral";

export function updateValue(ast: Module, nodeStart: number, classesToAdd: string[], classesToRemove: string[]): Module {
  const { ast: transformedAst, found } = traverseTemplateLiteral(ast, nodeStart, (node) => {
    // Process all quasis to remove classes
    for (let i = 0; i < node.quasis.length; i++) {
      const quasi = node.quasis[i];
      const currentValue = getQuasiValue(quasi);
      const newValue = updateClassTokens(currentValue, [], classesToRemove);

      const spacingContext = getQuasiSpacingContext(i, node.expressions.length);
      updateQuasiValue(quasi, newValue, spacingContext);
    }

    // Add new classes to the target quasi
    const target = findTargetQuasi(node.quasis);
    if (target) {
      const { quasi, index } = target;
      const currentValue = getQuasiValue(quasi).trim();
      const newValue = updateClassTokens(currentValue, classesToAdd, []);

      const spacingContext = getQuasiSpacingContext(index, node.expressions.length);
      updateQuasiValue(quasi, newValue, spacingContext);
    }
  });

  if (!found) {
    console.error("Template literal not found at nodeStart", nodeStart);
  }

  return transformedAst;
}
