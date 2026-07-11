import { addClassNameAttributeToJSXElement } from "@ast/jsx";
import { addValueToStringLiteral } from "@ast/string-literal/update";
import { findTemplateLiteralAtPosition } from "@ast/template-literal/find";
import { addValueToTemplateLiteral } from "@ast/template-literal/update/value";
import { getSelectedNode } from "@editor/canvas";
import { getFileLayerTree } from "@project/file-manager";
import type { Module } from "@swc/wasm-web";

export function createClassName(ast: Module, className: string, projectId: string, fileId: string): Module {
  const selectedNodeId = getSelectedNode(projectId, fileId);
  if (!selectedNodeId) {
    console.error("No selected node found");
    return ast;
  }

  const layerTree = getFileLayerTree(fileId, projectId);
  const nodeData = layerTree?.flat[selectedNodeId];
  if (!nodeData?.span) {
    console.error("Could not find node data for selected node");
    return ast;
  }

  if (nodeData.classes?.span?.start && nodeData.classes.span.start > 0) {
    const isTemplate = findTemplateLiteralAtPosition(ast, nodeData.classes.span.start);
    return isTemplate
      ? addValueToTemplateLiteral(ast, nodeData.classes.span.start, className)
      : addValueToStringLiteral(ast, nodeData.classes.span.start, className);
  }

  const elementSpanStart = nodeData.span.start;
  const { ast: updatedAst } = addClassNameAttributeToJSXElement(ast, elementSpanStart, className);

  return updatedAst;
}
