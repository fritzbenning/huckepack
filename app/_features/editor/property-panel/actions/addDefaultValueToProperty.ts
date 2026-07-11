import { addDefaultValueToParameter } from "@ast/parameter/create";
import { manipulateFileAST } from "@ast/utils";

export async function addDefaultValueToProperty(params: {
  paramName: string;
  newValue: string | number | boolean;
  type: "StringLiteral" | "NumericLiteral" | "BooleanLiteral";
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { paramName, newValue, type } = params;

  return manipulateFileAST(
    params,
    (ast) => {
      return addDefaultValueToParameter(ast, paramName, newValue, type);
    },
    {
      nullErrorMessage: `Could not find parameter ${paramName} or parameter already has a default value`,
    }
  );
}
