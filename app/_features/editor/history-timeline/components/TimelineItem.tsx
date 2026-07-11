import { cva } from "class-variance-authority";
import type { TimelineItem as TimelineItemType } from "../types";

const timelineItemVariants = cva("origin-bottom rounded transition-all", {
  variants: {
    type: {
      diff: "h-8 w-0.75 cursor-pointer group-hover:scale-y-125",
      version: "h-12 w-1 cursor-default group-hover:scale-y-115",
    },
    state: {
      default: "",
      current: "",
      selected: "bg-primary-500",
    },
  },
  compoundVariants: [
    {
      type: "diff",
      state: "default",
      className: "bg-neutral-300 dark:bg-neutral-750",
    },
    {
      type: "diff",
      state: "current",
      className: "bg-primary-500",
    },
    {
      type: "version",
      state: "default",
      className: "bg-neutral-300 dark:bg-neutral-750",
    },
    {
      type: "version",
      state: "current",
      className: "bg-neutral-400 dark:bg-neutral-600",
    },
  ],
  defaultVariants: {
    type: "diff",
    state: "default",
  },
});

interface TimelineItemProps {
  item: TimelineItemType;
  isCurrent: boolean;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export function TimelineItem({ item, isCurrent, isSelected, onClick, onMouseEnter, onMouseLeave }: TimelineItemProps) {
  const isDiff = item.type === "diff";
  const state = isCurrent ? "current" : isSelected ? "selected" : "default";

  return (
    <div className="group px-0.75">
      <div
        className={timelineItemVariants({
          type: item.type,
          state,
        })}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        title={isDiff ? `Diff ${item.index + 1}` : `Version ${item.version}`}
      />
    </div>
  );
}
