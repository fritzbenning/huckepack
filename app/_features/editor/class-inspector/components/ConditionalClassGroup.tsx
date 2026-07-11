import type { ExpressionSegment } from "@editor/class-manager/types";
import { useMemo } from "react";
import { useExpressionType } from "../hooks/useExpressionType";
import { ConditionalBranchClasses } from "./ConditionalBranchClasses";
import { ConditionHeader } from "./ConditionHeader";
import { ElseDivider } from "./ElseDivider";

const EMPTY_CLASSES: string[] = [];

interface ConditionalClassGroupProps {
  segment: ExpressionSegment;
  projectId: string;
  fileId: string;
}

export function ConditionalClassGroup({ segment, projectId, fileId }: ConditionalClassGroupProps) {
  const { isLogicalAnd } = useExpressionType(segment.expressionType);

  const alternateClasses = useMemo(() => {
    if (segment.expressionType === "conditional" && segment.alternate) {
      return segment.alternate.classes;
    }
    return EMPTY_CLASSES;
  }, [segment]);

  if (segment.expressionType === "unknown") {
    return null;
  }

  return (
    <div className="w-full rounded-lg bg-neutral-100 dark:bg-neutral-900">
      <ConditionHeader segment={segment} projectId={projectId} fileId={fileId} />

      {segment.consequent && (
        <ConditionalBranchClasses
          branch="consequent"
          projectId={projectId}
          fileId={fileId}
          segmentStart={segment.span.start}
          selectedNodeAstPosition={segment.consequent.span.start}
          classes={segment.consequent.classes}
        />
      )}
      <ElseDivider />
      <ConditionalBranchClasses
        branch="alternate"
        isLogicalAnd={isLogicalAnd}
        segment={segment}
        segmentStart={segment.span.start}
        selectedNodeAstPosition={
          segment.expressionType === "conditional" && segment.alternate ? segment.alternate.span.start : null
        }
        projectId={projectId}
        fileId={fileId}
        classes={alternateClasses}
      />
    </div>
  );
}
