import {
  createJSXAttribute,
  createJSXElement,
  createJSXText,
  insertElementAtTopLevel,
  insertElementIntoNode,
} from "@ast/jsx";
import { findReturnStatement } from "@ast/return-statement";
import { manipulateFileAST } from "@ast/utils";
import { getSelectedNode } from "@editor/canvas";
import type { Module } from "@swc/wasm-web";
import { findJSXElementById } from "../services/findNodeById";

export async function insertNode(params: {
  elementType: string;
  projectId: string;
  fileId: string;
  classes?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { elementType, projectId, fileId, classes } = params;

  // Validate element type
  if (!elementType || elementType.trim() === "") {
    return {
      success: false,
      error: "Element type is required",
    };
  }

  return manipulateFileAST(
    { projectId, fileId },
    (ast: Module) => {
      // Create the new JSX element with default children for specific element types
      const children =
        elementType === "span" ? [createJSXText("Text")] : elementType === "button" ? [createJSXText("Button")] : [];
      const newElement = createJSXElement(elementType, children);

      // Add className attribute if classes are provided
      if (classes) {
        const classNameAttr = createJSXAttribute("className", classes);
        newElement.opening.attributes.push(classNameAttr as unknown as (typeof newElement.opening.attributes)[0]);
      }

      // Check if a node is selected
      const selectedNodeId = getSelectedNode(projectId, fileId);

      if (selectedNodeId) {
        // Find the selected node in the AST
        const selectedNode = findJSXElementById(ast, selectedNodeId, projectId, fileId);

        if (selectedNode) {
          // Insert as last child of selected node
          return insertElementIntoNode(ast, selectedNode, newElement);
        } else {
          // Selected node not found, fall back to top-level insertion
          const returnStatement = findReturnStatement(ast);
          if (returnStatement) {
            return insertElementAtTopLevel(ast, returnStatement, newElement);
          }
          return null;
        }
      } else {
        // No node selected, insert at top level
        const returnStatement = findReturnStatement(ast);
        if (returnStatement) {
          return insertElementAtTopLevel(ast, returnStatement, newElement);
        }
        return null;
      }
    },
    {
      nullErrorMessage: "Could not find insertion point. Make sure the file has a return statement.",
    }
  );
}
