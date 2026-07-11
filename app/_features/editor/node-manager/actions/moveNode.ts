import { getSpan } from "@ast/core/get/getSpan";
import { findJSXElementBySpan, type MoveDirection, moveJSXElementInFragment, moveJSXElementInParent } from "@ast/jsx";
import { isJSXFragment, isParenthesisExpression } from "@ast/type-check";
import { manipulateFileAST } from "@ast/utils";
import { createTransformedAST } from "@ast/utils";
import { setSelectedNode } from "@editor/canvas/stores/canvasStore";
import { getFileLayerTree } from "@project/file-manager/stores/fileManagerStore";
import type { JSXElement, Module } from "@swc/wasm-web";
import { simple } from "swc-walk";
import { findParentNode } from "../services/findParentNode";
import { extractIndexFromNodeId } from "../utils/extractIndexFromNodeId";
import { extractTagNameFromNodeId } from "../utils/extractTagNameFromNodeId";

export async function moveNode(params: {
  nodeId: string;
  projectId: string;
  fileId: string;
  direction: MoveDirection;
}): Promise<{ success: boolean; error?: string }> {
  const { nodeId, projectId, fileId, direction } = params;

  if (!nodeId || nodeId.trim() === "") {
    return {
      success: false,
      error: "Node ID is required",
    };
  }

  const layerTree = getFileLayerTree(fileId, projectId);
  const currentNode = layerTree.flat[nodeId];

  if (!currentNode) {
    return {
      success: false,
      error: "Could not find node in layerTree",
    };
  }

  const lastSeparatorIndex = nodeId.lastIndexOf(">");
  const parentId = lastSeparatorIndex >= 0 ? nodeId.substring(0, lastSeparatorIndex) : "";

  const lastSegment = lastSeparatorIndex >= 0 ? nodeId.substring(lastSeparatorIndex + 1) : nodeId;
  const currentSiblingIndex = extractIndexFromNodeId(lastSegment);
  const tagName = extractTagNameFromNodeId(lastSegment);

  // Calculate expected new sibling index before AST manipulation
  const expectedNewSiblingIndex = direction === "up" ? currentSiblingIndex - 1 : currentSiblingIndex + 1;

  return manipulateFileAST(
    { projectId, fileId },
    (ast: Module) => {
      const nodeToMove = findJSXElementBySpan(ast, currentNode.span.start);
      if (!nodeToMove) {
        return null;
      }

      const parentNode = findParentNode(ast, nodeToMove, projectId, fileId);
      if (!parentNode) {
        return null;
      }

      const parentSpanStart = getSpan(parentNode).start;
      let moved = false;

      const transformedAst = createTransformedAST(ast);

      simple(transformedAst, {
        JSXElement(node) {
          if (moved) return;
          const result = moveJSXElementInParent(
            node as unknown as JSXElement,
            currentNode.span.start,
            parentSpanStart,
            currentSiblingIndex,
            direction
          );
          if (result.moved) {
            moved = true;
          }
        },
      });

      if (!moved) {
        simple(transformedAst, {
          ReturnStatement(returnNode) {
            if (moved || !returnNode.argument) return;

            let rootExpression = returnNode.argument;

            if (isParenthesisExpression(rootExpression)) {
              rootExpression = rootExpression.expression;
            }

            if (isJSXFragment(rootExpression)) {
              moved = moveJSXElementInFragment(rootExpression, currentNode.span.start, direction);
            }
          },
        });
      }

      return moved ? transformedAst : null;
    },
    {
      nullErrorMessage:
        direction === "up"
          ? "Could not move node up. Node may already be at the first position or parent not found."
          : "Could not move node down. Node may already be at the last position or parent not found.",
    }
  ).then((result) => {
    if (expectedNewSiblingIndex >= 0) {
      const segment = `${tagName}[${expectedNewSiblingIndex}]`;
      const newNodeId = parentId ? `${parentId}>${segment}` : segment;

      if (newNodeId !== nodeId) {
        setSelectedNode(projectId, fileId, newNodeId);
      }
    }

    if (!result.success) {
      setSelectedNode(projectId, fileId, nodeId);
    }

    return result;
  });
}
