import { useEffect, useRef } from "react";
import { SpotlightListItem, type SpotlightListItem as SpotlightListItemType } from "./SpotlightListItem";

export type { SpotlightListItemType };

export interface SpotlightListProps {
  items: SpotlightListItemType[];
  highlightedIndex?: number;
  onSelect: (value: string) => void;
  maxHeight?: number;
  listboxId?: string;
}

export function SpotlightList({ items, highlightedIndex, onSelect, maxHeight = 500, listboxId }: SpotlightListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightedItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (highlightedIndex !== undefined && highlightedIndex >= 0 && highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      id={listboxId}
      ref={containerRef}
      role="listbox"
      aria-label="Search results"
      className="overflow-y-auto"
      style={{ maxHeight }}
    >
      <div className="flex flex-col gap-1 px-2 py-2">
        {items.map((item, index) => {
          const isHighlighted = highlightedIndex === index;
          const itemId = listboxId ? `${listboxId}-option-${index}` : undefined;

          return (
            <SpotlightListItem
              key={item.value}
              ref={isHighlighted ? highlightedItemRef : null}
              item={item}
              index={index}
              isHighlighted={isHighlighted}
              onSelect={onSelect}
              itemId={itemId}
            />
          );
        })}
      </div>
    </div>
  );
}
