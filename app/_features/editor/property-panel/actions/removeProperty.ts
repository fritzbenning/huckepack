import { removeInterfaceProperty } from "@ast/interface";
import { removeParameter } from "@ast/parameter";
import { manipulateFileAST } from "@ast/utils";
import { getFile } from "@project/file-manager/stores/fileManagerStore";

export async function removeProperty(params: {
  propertyName: string;
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { propertyName, projectId, fileId } = params;

  const file = getFile(fileId, projectId);
  if (!file) {
    return { success: false, error: `File ${fileId} not found` };
  }

  const fileName = file.name;

  // Combine both operations into a single manipulateFileAST call
  // This ensures only one reprocessing step, avoiding double operations
  const result = await manipulateFileAST(
    { projectId, fileId },
    (ast) => {
      // First, remove from interface
      const interfaceResult = removeInterfaceProperty(ast, propertyName);
      if (!interfaceResult) {
        console.error(`[removeProperty] Failed to remove property ${propertyName} from interface`);
        return null;
      }

      // Then, remove from parameters
      const parameterResult = removeParameter(interfaceResult, fileName, propertyName);
      if (!parameterResult) {
        console.error(`[removeProperty] Failed to remove parameter ${propertyName} from function ${fileName}`);
        return null;
      }

      return parameterResult;
    },
    {
      nullErrorMessage: `Could not remove property ${propertyName} from interface or function ${fileName}`,
    }
  );

  return result;
}

