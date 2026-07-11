import { removeValueFromStringLiteral } from "@ast/string-literal/update";
import { findTemplateLiteralAtPosition } from "@ast/template-literal/find";
import { removeClassFromConditionalAlternate } from "@ast/template-literal/update/alternate";
import { removeValueFromTemplateLiteral } from "@ast/template-literal/update/value";
import { manipulateFileAST } from "@ast/utils";

export async function removeClass(params: {
  className: string;
  nodeStart: number;
  projectId: string;
  fileId: string;
  branch?: "consequent" | "alternate";
}): Promise<{ success: boolean; error?: string }> {
  const { className, nodeStart, branch } = params;

  return manipulateFileAST(params, (ast) => {
    if (branch === "alternate" && nodeStart) {
      return removeClassFromConditionalAlternate(ast, nodeStart, className);
    } else {
      const isTemplate = findTemplateLiteralAtPosition(ast, nodeStart);

      if (isTemplate) {
        return removeValueFromTemplateLiteral(ast, nodeStart, className);
      } else {
        return removeValueFromStringLiteral(ast, nodeStart, className);
      }
    }
  });
}
