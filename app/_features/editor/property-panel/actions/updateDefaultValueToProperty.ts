import { updateDefaultValue } from "@ast/parameter";
import type { LiteralType } from "@ast/types/literal";
import { manipulateFileAST } from "@ast/utils";
import { getFile, updateFileParams } from "@project/file-manager";
import { extractParamsFromAST } from "../utils/extractParamsFromAST";

export async function updateDefaultValueToProperty(params: {
  paramName: string;
  newValue: string | number | boolean;
  type: LiteralType;
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { paramName, newValue, type, projectId, fileId } = params;

  const result = await manipulateFileAST(
    { projectId, fileId },
    (ast) => {
      return updateDefaultValue(ast, paramName, newValue, type);
    },
    {
      nullErrorMessage: `Could not update default value for parameter ${paramName}`,
    }
  );

  // Re-extract params from the updated AST and update the store
  if (result.success && result.updatedAst) {
    const file = getFile(fileId, projectId);
    if (file) {
      const updatedParams = extractParamsFromAST(result.updatedAst, file.name);
      updateFileParams(fileId, updatedParams, projectId);
    }
  }

  return result;
}
