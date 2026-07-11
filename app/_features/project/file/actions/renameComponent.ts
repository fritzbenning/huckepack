import { renameComponent as renameComponentAST } from "@ast/component";
import { manipulateFileAST } from "@ast/utils";

export const renameComponent = async (params: {
  fileId: string;
  projectId: string;
  oldComponentName: string;
  newComponentName: string;
}): Promise<{ success: boolean; error?: string }> => {
  const { oldComponentName, newComponentName, projectId, fileId } = params;

  if (oldComponentName === newComponentName) {
    return { success: true };
  }

  return manipulateFileAST(
    { projectId, fileId },
    (ast) => renameComponentAST(ast, oldComponentName, newComponentName),
    {
      nullErrorMessage: `Could not rename component ${oldComponentName} to ${newComponentName}`,
    }
  );
};
