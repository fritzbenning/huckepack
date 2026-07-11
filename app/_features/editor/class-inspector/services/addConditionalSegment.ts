import { addConditionalSegmentToTemplateLiteral } from "@ast/template-literal/update/segments";
import { manipulateFileAST } from "@ast/utils";

export async function addConditionalSegment(params: {
  projectId: string;
  fileId: string;
  selectedNodeAstPosition: number;
  property: string;
  operator: string;
  testValue: string | number | boolean;
}): Promise<{ success: boolean; error?: string }> {
  const { selectedNodeAstPosition, property, operator, testValue } = params;

  return manipulateFileAST(params, (ast) => {
    return addConditionalSegmentToTemplateLiteral(ast, selectedNodeAstPosition, property, operator, testValue);
  });
}
