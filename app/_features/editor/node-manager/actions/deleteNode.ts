import { removeJSXElement } from "@ast/jsx/remove";
import { manipulateFileAST } from "@ast/utils";
import type { Module } from "@swc/wasm-web";
import { findJSXElementById } from "../services/findNodeById";
import { isComponentElement } from "../utils/isComponentElement";
import { removeUnusedComponentImport } from "../utils/removeUnusedComponentImport";

export async function deleteNode(params: {
  nodeId: string;
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { nodeId, projectId, fileId } = params;

  // Validate node ID
  if (!nodeId || nodeId.trim() === "") {
    return {
      success: false,
      error: "Node ID is required",
    };
  }

  return manipulateFileAST(
    { projectId, fileId },
    (ast: Module) => {
      // Find the node to delete
      const nodeToDelete = findJSXElementById(ast, nodeId, projectId, fileId);

      if (!nodeToDelete) {
        return null;
      }

      // Check if this is a component
      const isComponent = isComponentElement(nodeToDelete);
      let updatedAst = removeJSXElement(ast, nodeToDelete);

      if (!updatedAst) {
        return null;
      }

      if (isComponent) {
        updatedAst = removeUnusedComponentImport(updatedAst, nodeToDelete);
      }

      return updatedAst;
    },
    {
      nullErrorMessage: "Could not find node to delete or node cannot be deleted.",
    }
  );
}
