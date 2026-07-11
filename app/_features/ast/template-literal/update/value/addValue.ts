import type { Module } from "@swc/wasm-web";
import { addClassToken } from "@ast/utils";
import { findTargetQuasi, getQuasiSpacingContext, getQuasiValue, updateQuasiValue } from "../../utils/quasiValue";
import { traverseTemplateLiteral } from "../../utils/traverseTemplateLiteral";

export function addValue(ast: Module, nodeStart: number, valueToAdd: string): Module {
  const { ast: transformedAst, found } = traverseTemplateLiteral(ast, nodeStart, (node) => {
    const target = findTargetQuasi(node.quasis);
    if (!target) return false;

    const { quasi, index } = target;
    const currentValue = getQuasiValue(quasi).trim();
    const newValue = addClassToken(currentValue, valueToAdd);

    const spacingContext = getQuasiSpacingContext(index, node.expressions.length);
    updateQuasiValue(quasi, newValue, spacingContext);
  });

  if (!found) {
    console.error("Template literal not found at nodeStart", nodeStart);
  }

  return transformedAst;
}

