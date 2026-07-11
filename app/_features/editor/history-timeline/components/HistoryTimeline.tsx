import type { Id } from "@convex/_generated/dataModel";
import { useUser } from "@hub/auth/hooks/useUser";
import { PlusIcon } from "@phosphor-icons/react";
import Button from "@shared/ui-kit/ui/Button";
import { ModalContent } from "@shared/ui-kit/ui/ModalContent";
import { format } from "date-fns";
import { createVersionFromDiff } from "../actions/createVersionFromDiff";
import { navigateToDiff } from "../actions/navigateToDiff";
import { useHistoryTimeline } from "../hooks/useHistoryTimeline";
import { TimelineItem } from "./TimelineItem";

interface HistoryTimelineProps {
  projectId: Id<"projects">;
  fileId: Id<"files">;
}

export function HistoryTimeline({ projectId, fileId }: HistoryTimelineProps) {
  const {
    timelineData,
    history,
    selectedItem,
    selectedDiffIndex,
    displayItem,
    selectedIndex,
    handleItemSelect,
    clearSelection,
    handleItemHover,
  } = useHistoryTimeline(fileId, projectId);

  const userId = displayItem?.userId ?? null;
  const { user } = useUser(userId);

  const handleItemClick = async (index: number, diffIndex: number | null) => {
    handleItemSelect(index);

    if (diffIndex !== null && history) {
      await navigateToDiff(fileId, projectId, history, diffIndex);
    }
  };

  const handleCreateVersion = async () => {
    if (!history) {
      return;
    }

    try {
      await createVersionFromDiff(fileId, history, selectedDiffIndex);
      clearSelection();
    } catch (error) {
      console.error("[HistoryTimeline] Failed to create version", error);
    }
  };

  if (!timelineData || !history) {
    return (
      <div className="flex h-full items-center justify-center text-neutral-500 dark:text-neutral-400">
        No history available
      </div>
    );
  }

  return (
    <ModalContent className="flex flex-col py-6">
      {displayItem && (
        <div className="flex min-h-7 items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="w-40 text-sm text-neutral-600 dark:text-neutral-400">
              {format(new Date(displayItem.type === "diff" ? displayItem.timestamp : displayItem.createdAt), "PPpp")}
            </div>
            {user && (
              <div className="text-sm text-neutral-500 dark:text-neutral-500">
                by {user.name ?? user.email?.split("@")[0] ?? "Unknown"}
              </div>
            )}
          </div>
          {selectedItem && (
            <Button size="tiny" icon={PlusIcon} onClick={handleCreateVersion}>
              Create Version
            </Button>
          )}
        </div>
      )}
      <div className="flex flex-1 items-center overflow-x-auto pt-3">
        {timelineData.items.length > 0 ? (
          <div className="flex items-end">
            {timelineData.items.map((item, index) => {
              const isCurrent = item.type === "diff" && item.index === timelineData.currentHistoryPointer;
              const isSelected = selectedIndex === index;

              const handleClick = () => {
                handleItemClick(index, item.type === "diff" ? item.index : null);
              };

              const handleMouseEnter = () => {
                handleItemHover(index);
              };

              const handleMouseLeave = () => {
                handleItemHover(null);
              };

              return (
                <TimelineItem
                  key={`${item.type}-${item.type === "diff" ? item.index : item.version}`}
                  item={item}
                  isCurrent={isCurrent}
                  isSelected={isSelected}
                  onClick={handleClick}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-500 dark:text-neutral-400">
            No timeline items
          </div>
        )}
      </div>
    </ModalContent>
  );
}
