import { replaceLiteral } from "@ast/literal/update";
import { manipulateFileAST } from "@ast/utils";

export async function updatePropertyValue(params: {
  paramName: string;
  newValue: string | number | boolean;
  spanStart: number;
  type: "StringLiteral" | "NumericLiteral" | "BooleanLiteral";
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { spanStart, newValue, type } = params;

  return manipulateFileAST(params, (ast) => {
    return replaceLiteral(ast, spanStart, newValue, type);
  });
}
