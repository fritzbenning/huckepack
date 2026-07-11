import { cva } from "class-variance-authority";
import { forwardRef } from "react";

export interface SpotlightListItem {
  value: string;
  label: string;
}

const spotlightListItemVariants = cva("w-full rounded-lg px-4 py-2 text-left font-medium text-sm transition-colors", {
  variants: {
    isHighlighted: {
      true: "bg-neutral-150 text-neutral-950 dark:bg-neutral-800 dark:text-neutral-100",
      false: "text-neutral-750 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-850/50",
    },
  },
  defaultVariants: {
    isHighlighted: false,
  },
});

export interface SpotlightListItemProps {
  item: SpotlightListItem;
  index: number;
  isHighlighted: boolean;
  onSelect: (value: string) => void;
  itemId?: string;
}

export const SpotlightListItem = forwardRef<HTMLButtonElement, SpotlightListItemProps>(
  ({ item, isHighlighted, onSelect, itemId }, ref) => {
    return (
      <button
        ref={ref}
        id={itemId}
        type="button"
        role="option"
        aria-selected={isHighlighted}
        onClick={() => onSelect(item.value)}
        className={spotlightListItemVariants({ isHighlighted })}
      >
        {item.label}
      </button>
    );
  }
);

SpotlightListItem.displayName = "SpotlightListItem";
