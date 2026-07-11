import type { ExpressionSegment } from "@editor/class-manager/types";
import { cn } from "@lib/utils";
import { PencilSimpleIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { executeAction } from "@shared/action";
import { useOptimisticValue } from "@shared/memo";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import { Activity, memo, useState } from "react";
import { areSegmentsEqual } from "../utils/compareProps";
import { ClassEditor } from "./ClassEditor";
import { ClassLabel } from "./ClassLabel";
import { ClassSelector } from "./ClassSelector";

interface ClassItemProps {
  token: string;
  projectId: string;
  fileId: string;
  selectedNodeAstPosition: number | null;
  isNew?: boolean;
  initialEditMode?: boolean;
  onCancelNew?: () => void;
  onAddClass?: (className: string) => Promise<void>;
  className?: string;
  isLogicalAnd?: boolean;
  segment?: ExpressionSegment;
  segmentStart?: number;
  branch?: "consequent" | "alternate";
}

function ClassItemComponent({
  token,
  projectId,
  fileId,
  selectedNodeAstPosition,
  isNew = false,
  initialEditMode = false,
  onCancelNew,
  onAddClass,
  className,
  branch,
}: ClassItemProps) {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [editValue, setEditValue] = useState(token);
  // Optimistic token value - shows immediately while update is processing
  const [optimisticToken, setOptimisticToken] = useOptimisticValue(token);

  const deleteClass = async (token: string) => {
    if (selectedNodeAstPosition) {
      await executeAction("node.class.remove", {
        className: token,
        nodeStart: selectedNodeAstPosition,
        projectId,
        fileId,
        branch,
      });
    } else {
      console.error("No node start found");
    }
  };

  const replaceClass = async (prevToken: string, newToken: string) => {
    if (selectedNodeAstPosition) {
      await executeAction("node.class.replace", {
        oldClassName: prevToken,
        newClassName: newToken,
        nodeStart: selectedNodeAstPosition,
        projectId,
        fileId,
      });
    } else {
      console.error("No node start found");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(optimisticToken);
  };

  const handleSave = async (newValue: string) => {
    if (isNew) {
      if (newValue.trim()) {
        const className = newValue.trim();
        await onAddClass?.(className);
      }
      onCancelNew?.();
    } else {
      const trimmedValue = newValue.trim();
      if (trimmedValue && trimmedValue !== optimisticToken) {
        // Capture the original token before optimistic update
        const originalToken = optimisticToken;
        // Optimistic update: immediately show the new value
        setOptimisticToken(trimmedValue);
        setIsEditing(false);

        try {
          await replaceClass(originalToken, trimmedValue);
          // Success: token prop will update via useEffect, syncing optimisticToken
        } catch (error) {
          console.error("Failed to replace class:", error);
          // Revert optimistic update on error
          setOptimisticToken(token);
          // Could show a toast notification here
        }
      } else {
        setIsEditing(false);
      }
    }
  };

  const handleCancel = () => {
    if (isNew) {
      onCancelNew?.();
    } else {
      setEditValue(optimisticToken);
      setIsEditing(false);
    }
  };

  // Don't render if it's a new empty class that's not being edited
  if (isNew && !token && !isEditing) {
    return null;
  }

  return (
    <div className={cn("group flex h-3.25 items-center justify-between gap-2 font-mono", className)}>
      <div className="flex flex-1 items-center gap-0.5 text-2xs">
        <ClassSelector />
        {isEditing ? (
          <ClassEditor
            editValue={editValue}
            token={optimisticToken}
            onEditValue={setEditValue}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ) : (
          <button
            type="button"
            className="text-neutral-600 transition-colors group-hover:text-black dark:text-neutral-300 dark:group-hover:text-white"
            onClick={handleEdit}
          >
            <ClassLabel token={optimisticToken} />
          </button>
        )}
      </div>
      <Activity mode={!isEditing ? "visible" : "hidden"}>
        <div className="invisible flex shrink-0 items-center gap-2 opacity-0 group-hover:visible group-hover:opacity-100">
          {/* <InlineIconButton icon={Braces} onClick={() => addCondition(token)} title="Add condition" /> */}
          <InlineIconButton icon={PencilSimpleIcon} onClick={handleEdit} title="Replace class" weight="regular" />
          <InlineIconButton
            icon={TrashSimpleIcon}
            onClick={() => deleteClass(optimisticToken)}
            title="Delete class"
            weight="regular"
          />
        </div>
      </Activity>
    </div>
  );
}

export const ClassItem = memo(ClassItemComponent, (prevProps, nextProps) => {
  // Custom comparison for segment object (compare by span.start)
  if (!areSegmentsEqual(prevProps.segment, nextProps.segment)) {
    return false; // Re-render
  }

  // Shallow comparison for all other props
  // Return true to skip re-render (props are equal), false to re-render
  return (
    prevProps.token === nextProps.token &&
    prevProps.projectId === nextProps.projectId &&
    prevProps.fileId === nextProps.fileId &&
    prevProps.selectedNodeAstPosition === nextProps.selectedNodeAstPosition &&
    prevProps.isNew === nextProps.isNew &&
    prevProps.initialEditMode === nextProps.initialEditMode &&
    prevProps.onCancelNew === nextProps.onCancelNew &&
    prevProps.className === nextProps.className &&
    prevProps.isLogicalAnd === nextProps.isLogicalAnd &&
    prevProps.segmentStart === nextProps.segmentStart &&
    prevProps.branch === nextProps.branch
  );
});
