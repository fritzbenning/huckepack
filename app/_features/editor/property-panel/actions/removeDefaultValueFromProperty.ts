import { removeDefaultValueFromParameter } from "@ast/parameter/remove";
import { manipulateFileAST } from "@ast/utils";

export async function removeDefaultValueFromProperty(params: {
  paramName: string;
  fileName: string;
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { paramName, fileName } = params;

  return manipulateFileAST(
    params,
    (ast) => {
      return removeDefaultValueFromParameter(ast, fileName, paramName);
    },
    {
      nullErrorMessage: `Could not find parameter ${paramName} in function ${fileName} or parameter does not have a default value`,
    }
  );
}
