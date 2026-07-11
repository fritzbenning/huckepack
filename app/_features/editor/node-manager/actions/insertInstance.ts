import { createSpan } from "@ast/core/create/createSpan";
import { createIdentifier } from "@ast/identifier/create/createIdentifier";
import { createImportStatement } from "@ast/import/create/createImportStatement";
import { findImport } from "@ast/import/utils/findImport";
import { createJSXElement, createJSXText, insertElementAtTopLevel, insertElementIntoNode } from "@ast/jsx";
import { findReturnStatement } from "@ast/return-statement";
import { createTransformedAST, manipulateFileAST } from "@ast/utils";
import { getSelectedNode } from "@editor/canvas";
import { getFile } from "@project/file-manager";
import type { ImportDeclaration, Module } from "@swc/wasm-web";
import { calculateRelativePath } from "../../floating-toolbar/utils/calculateRelativePath";
import { findJSXElementById } from "../services/findNodeById";
import { createJSXAttributeWithValue } from "./createJSXAttributeWithValue";

export async function insertInstance(params: {
  instanceFileId: string;
  projectId: string;
  targetFileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { instanceFileId, projectId, targetFileId } = params;

  // Get the component file to insert
  const componentFile = getFile(instanceFileId, projectId);
  if (!componentFile) {
    return {
      success: false,
      error: "Component file not found",
    };
  }

  // Get the current file
  const currentFile = getFile(targetFileId, projectId);
  if (!currentFile) {
    return {
      success: false,
      error: "Current file not found",
    };
  }

  // Get component name from slug (valid JavaScript identifier)
  const componentName = componentFile.slug;

  // Calculate relative import path
  const relativePath = calculateRelativePath(currentFile.path, componentFile.path);

  // Get component export type
  const exportType = componentFile.export || "default";

  // Get mandatory props (params that don't have default values)
  const mandatoryProps: Array<{ name: string; value: string | number | boolean }> = [];
  if (componentFile.params) {
    for (const [paramName, param] of Object.entries(componentFile.params)) {
      // Skip children prop
      if (paramName === "children") continue;

      // If param has no default value, it's mandatory
      if (param.defaultValue === null || param.defaultValue === undefined) {
        // Use a default value based on type
        let defaultValue: string | number | boolean = "";
        if (param.type === "number") {
          defaultValue = 0;
        } else if (param.type === "boolean") {
          defaultValue = false;
        } else {
          defaultValue = paramName; // Use param name as placeholder
        }
        mandatoryProps.push({ name: paramName, value: defaultValue });
      }
    }
  }

  return manipulateFileAST(
    { projectId, fileId: targetFileId },
    (ast: Module) => {
      const transformedAst = createTransformedAST(ast);

      // Step 1: Add import statement (only if it doesn't already exist)
      const existingImport = findImport(transformedAst, componentName, relativePath);

      if (!existingImport) {
        // Find the last import declaration
        let lastImportIndex = -1;
        for (let i = 0; i < transformedAst.body.length; i++) {
          if (transformedAst.body[i].type === "ImportDeclaration") {
            lastImportIndex = i;
          }
        }

        // Create import statement based on export type
        let importDeclaration: ImportDeclaration;

        if (exportType === "default") {
          // For default imports, create ImportDefaultSpecifier
          importDeclaration = {
            type: "ImportDeclaration",
            span: createSpan(),
            specifiers: [
              {
                type: "ImportDefaultSpecifier",
                span: createSpan(),
                local: createIdentifier(componentName, 2), // Imported identifiers use ctxt: 2
              },
            ],
            source: {
              type: "StringLiteral",
              span: createSpan(),
              value: relativePath,
              raw: `"${relativePath}"`,
            },
            typeOnly: false,
          };
        } else if (exportType === "named") {
          // For named imports, use createImportStatement
          importDeclaration = createImportStatement({
            specifiers: [{ name: componentName }],
            source: relativePath,
          });
        } else {
          // Default to named import
          importDeclaration = createImportStatement({
            specifiers: [{ name: componentName }],
            source: relativePath,
          });
        }

        // Insert import after last import or at the beginning
        const insertIndex = lastImportIndex + 1;
        transformedAst.body.splice(insertIndex, 0, importDeclaration as unknown as (typeof transformedAst.body)[0]);
      }

      // Step 2: Create JSX element with component name
      const children = [createJSXText(componentName)];
      const newElement = createJSXElement(componentName, children);

      // Step 3: Add mandatory props as attributes
      for (const prop of mandatoryProps) {
        const attr = createJSXAttributeWithValue(prop.name, prop.value);
        newElement.opening.attributes.push(attr as unknown as (typeof newElement.opening.attributes)[0]);
      }

      // Step 4: Insert the element
      const selectedNodeId = getSelectedNode(projectId, targetFileId);

      if (selectedNodeId) {
        // Find the selected node in the AST
        const selectedNode = findJSXElementById(transformedAst, selectedNodeId, projectId, targetFileId);

        if (selectedNode) {
          // Insert as last child of selected node
          return insertElementIntoNode(transformedAst, selectedNode, newElement);
        } else {
          // Selected node not found, fall back to top-level insertion
          const returnStatement = findReturnStatement(transformedAst);
          if (returnStatement) {
            return insertElementAtTopLevel(transformedAst, returnStatement, newElement);
          }
          return null;
        }
      } else {
        // No node selected, insert at top level
        const returnStatement = findReturnStatement(transformedAst);
        if (returnStatement) {
          return insertElementAtTopLevel(transformedAst, returnStatement, newElement);
        }
        return null;
      }
    },
    {
      nullErrorMessage: "Could not find insertion point. Make sure the file has a return statement.",
    }
  );
}
