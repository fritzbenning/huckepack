import { removeConditionalSegmentFromTemplateLiteral } from "@ast/template-literal/update/segments";
import { manipulateFileAST } from "@ast/utils";

export async function removeConditionalSegment(params: {
  projectId: string;
  fileId: string;
  expressionSpanStart: number;
}): Promise<{ success: boolean; error?: string }> {
  const { expressionSpanStart } = params;

  return manipulateFileAST(params, (ast) => {
    return removeConditionalSegmentFromTemplateLiteral(ast, expressionSpanStart);
  });
}
