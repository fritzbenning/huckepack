import { getSpan } from "@ast/core/get/getSpan";
import { updateJSXChildren, updateJSXChildrenWithExpression } from "@ast/jsx";
import { createTransformedAST, manipulateFileAST } from "@ast/utils";
import type { Id } from "@convex/_generated/dataModel";
import { updateProperty } from "@editor/property-panel/services/updateProperty";
import { getFile, getFileAST } from "@project/file-manager/stores/fileManagerStore";
import type { Module } from "@swc/wasm-web";
import { findJSXElementById } from "../services/findNodeById";
import { getComponentFileFromNode } from "../utils/getComponentFileFromNode";
import { getPropertyNameFromJSXChildren } from "../utils/getPropertyNameFromJSXChildren";

export async function updateNodeText(params: {
  nodeId: string;
  textContent: string;
  projectId: string;
  fileId: Id<"files">;
}): Promise<{ success: boolean; error?: string }> {
  const { nodeId, textContent: rawTextContent, projectId, fileId } = params;

  const textContent = typeof rawTextContent === "string" ? rawTextContent : String(rawTextContent);

  if (!nodeId || nodeId.trim() === "") {
    return {
      success: false,
      error: "Node ID is required",
    };
  }

  const file = getFile(fileId, projectId as Id<"projects">);
  if (!file) {
    return {
      success: false,
      error: `File ${fileId} not found`,
    };
  }

  const ast = await getFileAST(fileId, projectId as Id<"projects">);
  if (!ast) {
    return {
      success: false,
      error: `AST not found for file ${fileId}`,
    };
  }

  const element = findJSXElementById(ast, nodeId, projectId, fileId);
  if (!element) {
    return {
      success: false,
      error: `Could not find element with id ${nodeId}`,
    };
  }

  const componentFile = getComponentFileFromNode(element, ast, projectId, fileId, file.path);
  const existingPropName = getPropertyNameFromJSXChildren(element);

  if (componentFile) {
    const componentFileData = getFile(componentFile.fileId as Id<"files">, projectId as Id<"projects">);
    if (!componentFileData) {
      return {
        success: false,
        error: `Component file ${componentFile.fileId} not found`,
      };
    }

    const properties = componentFileData.properties || {};
    const propertyNames = Object.keys(properties);

    let propNameToUse: string | null = null;

    if (existingPropName && properties[existingPropName]) {
      propNameToUse = existingPropName;
    } else if (propertyNames.includes(textContent)) {
      propNameToUse = textContent;
    }

    if (propNameToUse) {
      const property = properties[propNameToUse];
      const paramType = property.type?.kind || "string";

      const updatePropertyResult = await updateProperty({
        paramName: propNameToUse,
        newValue: textContent,
        paramType,
        params: componentFileData.params,
        projectId,
        fileId: componentFile.fileId,
      });

      if (!updatePropertyResult?.success) {
        return updatePropertyResult || { success: false, error: "Failed to update property" };
      }

      return manipulateFileAST(
        { projectId, fileId },
        (ast: Module) => {
          const transformedAst = createTransformedAST(ast);
          const element = findJSXElementById(transformedAst, nodeId, projectId, fileId);

          if (!element) {
            return null;
          }

          const elementSpanStart = getSpan(element).start;
          return updateJSXChildrenWithExpression(transformedAst, elementSpanStart, propNameToUse!);
        },
        {
          nullErrorMessage: `Could not find element with id ${nodeId}`,
        }
      );
    }
  }

  const childrenValue = textContent === null || textContent === "" ? null : textContent;
  return manipulateFileAST(
    { projectId, fileId },
    (ast: Module) => {
      const transformedAst = createTransformedAST(ast);
      const element = findJSXElementById(transformedAst, nodeId, projectId, fileId);

      if (!element) {
        return null;
      }

      const elementSpanStart = getSpan(element).start;
      return updateJSXChildren(transformedAst, elementSpanStart, childrenValue);
    },
    {
      nullErrorMessage: `Could not find element with id ${nodeId}`,
    }
  );
}
