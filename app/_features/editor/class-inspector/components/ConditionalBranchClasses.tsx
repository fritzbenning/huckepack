import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import type { ExpressionSegment } from "@editor/class-manager/types";
import { PlusIcon } from "@phosphor-icons/react";
import { executeAction } from "@shared/action";
import { useOptimisticArray, useShallowEqual } from "@shared/memo";
import { useMemo, useState } from "react";
import { InlineAction } from "@shared/ui-kit/ui/InlineAction";
import { ClassItem } from "./ClassItem";

interface ConditionalBranchClassesProps {
  classes: string[];
  segmentStart: number;
  branch: "consequent" | "alternate";
  selectedNodeAstPosition: number | null;
  projectId: string;
  fileId: string;
  isLogicalAnd?: boolean;
  segment?: ExpressionSegment;
}

export function ConditionalBranchClasses({
  classes,
  segmentStart,
  branch,
  selectedNodeAstPosition,
  projectId,
  fileId,
  isLogicalAnd = false,
  segment,
}: ConditionalBranchClassesProps) {
  const [isOpen, setIsOpen] = useState(false);

  const memoizedClasses = useShallowEqual(classes);
  const [optimisticClasses, setOptimisticClasses] = useOptimisticArray(memoizedClasses);

  const hasClasses = optimisticClasses.length > 0;

  const handleAddClass = async (className: string) => {
    // Optimistically update UI
    setOptimisticClasses((current: string[]) => {
      if (current.includes(className)) {
        return current;
      }
      return [...current, className];
    });

    // Execute the actual action
    const hasselectedNodeAstPosition = !!selectedNodeAstPosition;
    const canAddToAlternate =
      branch === "alternate" && segment && (isLogicalAnd || segment.expressionType === "conditional");
    const canAddToConsequent = segment && branch === "consequent";

    if (hasselectedNodeAstPosition || canAddToAlternate || canAddToConsequent) {
      const nodeStart = selectedNodeAstPosition || 0;
      await executeAction("node.class.add", {
        className,
        nodeStart,
        projectId,
        fileId,
        isLogicalAnd,
        segmentStart,
        branch,
      });
    }
  };

  const handleCancelNew = () => {
    setIsOpen(false);
  };

  const classItems = useMemo(
    () =>
      optimisticClasses.map((cls: string, index: number) => {
        const isLast = index === optimisticClasses.length - 1;
        return (
          <div
            key={`conditional-${branch}-${segmentStart}-${cls}`}
            className="flex h-3.25 items-center justify-between gap-2"
          >
            <ClassItem
              token={cls}
              projectId={projectId}
              fileId={fileId}
              selectedNodeAstPosition={selectedNodeAstPosition}
              className="flex-1"
              branch={branch}
              segmentStart={segmentStart}
            />
            {isLast ? (
              <InlineIconButton
                icon={PlusIcon}
                onClick={() => setIsOpen(true)}
                title="Add new class"
                size="small"
                weight="regular"
              />
            ) : (
              <div className="size-3.25" />
            )}
          </div>
        );
      }),
    [optimisticClasses, branch, segmentStart, projectId, fileId, selectedNodeAstPosition]
  );

  return (
    <div className="flex flex-col gap-2 px-3 py-4">
      {classItems}
      {isOpen && (
        <ClassItem
          key={`conditional-${branch}-new-${segmentStart}`}
          token=""
          projectId={projectId}
          fileId={fileId}
          selectedNodeAstPosition={selectedNodeAstPosition}
          initialEditMode={true}
          onCancelNew={handleCancelNew}
          onAddClass={handleAddClass}
          isLogicalAnd={isLogicalAnd}
          segment={segment}
          segmentStart={segmentStart}
          branch={branch}
          isNew={true}
        />
      )}

      {!hasClasses && !isOpen && <InlineAction onClick={() => setIsOpen(true)} label="Add class" />}
    </div>
  );
}
