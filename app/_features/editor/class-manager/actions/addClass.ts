import { addValueToStringLiteral } from "@ast/string-literal/update";
import { findTemplateLiteralAtPosition } from "@ast/template-literal/find";
import { addClassToConditionalAlternate } from "@ast/template-literal/update/alternate";
import { addClassToConditionalConsequent } from "@ast/template-literal/update/consequent";
import { convertLogicalToConditional } from "@ast/template-literal/update/conversion";
import { addValueToTemplateLiteral } from "@ast/template-literal/update/value";
import { manipulateFileAST } from "@ast/utils";
import { getSelectedNode } from "@editor/canvas/stores/canvasStore";
import { removeClassSuggestionsForAddedClass } from "@editor/class-inspector/utils/removeClassSuggestions";
import type { Id } from "@convex/_generated/dataModel";
import { createClassName } from "./createClassName";

export async function addClass(params: {
  className: string;
  nodeStart: number;
  projectId: string;
  fileId: string;
  isLogicalAnd?: boolean;
  segmentStart?: number;
  branch?: "consequent" | "alternate";
}): Promise<{ success: boolean; error?: string }> {
  const { className, nodeStart, isLogicalAnd, segmentStart, branch, projectId, fileId } = params;

  const result = await manipulateFileAST(params, (ast) => {
    // Handle logical-and to conditional conversion first (doesn't need nodeStart)
    if (isLogicalAnd && branch === "alternate" && segmentStart !== undefined) {
      return convertLogicalToConditional(ast, segmentStart, className);
    }

    // Handle alternate branch: use segmentStart (conditional expression start) as primary identifier
    // nodeStart (alternate span) is optional and used for validation when available
    if (branch === "alternate" && segmentStart !== undefined) {
      return addClassToConditionalAlternate(ast, segmentStart, className, nodeStart || undefined);
    }

    // Handle consequent branch
    if (branch === "consequent" && (segmentStart !== undefined || nodeStart)) {
      return addClassToConditionalConsequent(ast, nodeStart || 0, className, segmentStart);
    }

    // Early return for creating new className attribute (no nodeStart and no branch/segment info)
    if (!nodeStart || nodeStart === 0) {
      return createClassName(ast, className, projectId, fileId);
    }

    const isTemplate = findTemplateLiteralAtPosition(ast, nodeStart);

    return isTemplate
      ? addValueToTemplateLiteral(ast, nodeStart, className)
      : addValueToStringLiteral(ast, nodeStart, className);
  });

  // Remove suggestions for the added class
  if (result.success) {
    const nodeId = getSelectedNode(projectId, fileId);
    if (nodeId) {
      removeClassSuggestionsForAddedClass(fileId as Id<"files">, nodeId, className, projectId as Id<"projects">);
    }
  }

  return result;
}
