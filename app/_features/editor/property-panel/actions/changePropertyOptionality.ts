import { updateInterfacePropertyOptionality } from "@ast/interface";
import { manipulateFileAST } from "@ast/utils";
import { getProperties } from "@project/ast-parser/utils/getProperties";
import { getFile } from "@project/file-manager";
import { updateFileContent } from "@project/file-manager/stores/fileManagerStore";
import type { TsInterfaceDeclaration } from "@swc/wasm-web";
import { simple } from "swc-walk";

export async function changePropertyOptionality(params: {
  propertyName: string;
  optional: boolean;
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { propertyName, optional, projectId, fileId } = params;

  // Get current AST
  const file = getFile(fileId, projectId);
  if (!file?.ast) {
    return { success: false, error: `No AST found for file ${fileId}` };
  }

  // Update the AST
  const updatedAst = updateInterfacePropertyOptionality(file.ast, propertyName, optional);
  if (!updatedAst) {
    return { success: false, error: `Could not find property ${propertyName} in interface` };
  }

  // Extract updated properties from the AST
  let updatedProperties = file.properties || {};

  simple(updatedAst, {
    TsInterfaceDeclaration(interfaceDecl) {
      updatedProperties = getProperties(interfaceDecl as TsInterfaceDeclaration);
    },
  });

  // Update properties in store immediately
  updateFileContent(fileId, projectId, {
    ast: updatedAst,
    properties: updatedProperties,
  });

  // Then update code and trigger full reprocessing (async)
  const result = await manipulateFileAST(
    { projectId, fileId },
    () => updatedAst, // Return the already-updated AST
    {
      nullErrorMessage: `Could not find property ${propertyName} in interface`,
    }
  );

  return result;
}
