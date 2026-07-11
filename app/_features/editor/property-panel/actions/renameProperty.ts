import { renameInterfaceProperty } from "@ast/interface";
import { renameParameter } from "@ast/parameter";
import { manipulateFileAST } from "@ast/utils";
import type { Id } from "@convex/_generated/dataModel";
import { getFile } from "@project/file-manager/stores/fileManagerStore";

export async function renameProperty(params: {
  oldPropertyName: string;
  newPropertyName: string;
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { oldPropertyName, newPropertyName, projectId, fileId } = params;

  if (oldPropertyName === newPropertyName) {
    return { success: true };
  }

  const file = getFile(fileId as Id<"files">, projectId);
  if (!file) {
    return { success: false, error: `File ${fileId} not found` };
  }

  const fileName = file.name;

  const result = await manipulateFileAST(
    { projectId, fileId },
    (ast) => {
      // First, rename in interface
      const interfaceResult = renameInterfaceProperty(ast, oldPropertyName, newPropertyName);
      if (!interfaceResult) {
        console.error(
          `[renameProperty] Failed to rename property ${oldPropertyName} to ${newPropertyName} in interface`
        );
        return null;
      }

      // Then, rename in parameters
      const parameterResult = renameParameter(interfaceResult, oldPropertyName, newPropertyName);
      if (!parameterResult) {
        console.error(
          `[renameProperty] Failed to rename parameter ${oldPropertyName} to ${newPropertyName} in function ${fileName}`
        );
        return null;
      }

      return parameterResult;
    },
    {
      nullErrorMessage: `Could not rename property ${oldPropertyName} to ${newPropertyName} in interface or function ${fileName}`,
    }
  );

  return result;
}
