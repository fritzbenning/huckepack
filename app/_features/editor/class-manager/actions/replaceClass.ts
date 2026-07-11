import { replaceValueInStringLiteral } from "@ast/string-literal/update";
import { findTemplateLiteralAtPosition } from "@ast/template-literal/find";
import { replaceValueInTemplateLiteral } from "@ast/template-literal/update/value";
import { manipulateFileAST } from "@ast/utils";
import { getSelectedNode } from "@editor/canvas/stores/canvasStore";
import { removeClassSuggestionsForReplacedClass } from "@editor/class-inspector/utils/removeClassSuggestions";
import type { Id } from "@convex/_generated/dataModel";

export async function replaceClass(params: {
  oldClassName: string;
  newClassName: string;
  nodeStart: number;
  projectId: string;
  fileId: string;
}): Promise<{ success: boolean; error?: string }> {
  const { oldClassName, newClassName, nodeStart, projectId, fileId } = params;

  const result = await manipulateFileAST(params, (ast) => {
    const isTemplate = findTemplateLiteralAtPosition(ast, nodeStart);

    return isTemplate
      ? replaceValueInTemplateLiteral(ast, nodeStart, oldClassName, newClassName)
      : replaceValueInStringLiteral(ast, nodeStart, oldClassName, newClassName);
  });

  // Remove suggestions for the replaced class
  if (result.success) {
    const nodeId = getSelectedNode(projectId, fileId);
    if (nodeId) {
      removeClassSuggestionsForReplacedClass(fileId as Id<"files">, nodeId, newClassName, projectId as Id<"projects">);
    }
  }

  return result;
}
