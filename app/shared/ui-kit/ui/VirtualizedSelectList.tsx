import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import type React from "react";
import { useLayoutEffect, useRef } from "react";
import { FixedSizeList } from "react-window";
import type { DynamicIconName } from "@/types/componentTypes";
import { SelectItem } from "./SelectItem";
import { selectContentVariants } from "./SelectList";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: Icon;
  iconName?: DynamicIconName;
}

export interface VirtualizedSelectListProps {
  options: SelectOption[];
  value?: string;
  onSelect: (value: string) => void;
  size?: "small" | "large";
  contentClassName?: string;
  itemClassName?: string;
  iconClassName?: string;
  maxHeight?: number;
  itemHeight?: number;
  highlightedIndex?: number;
  listboxId?: string;
}

type ListItemData = {
  options: SelectOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  itemClassName: string;
  iconClassName: string;
  highlightedIndex?: number;
  listboxId?: string;
};

interface ListItemProps {
  index: number;
  style: React.CSSProperties;
  data: ListItemData;
}

const ListItem: React.FC<ListItemProps> = ({ index, style, data }) => {
  const { options, selectedValue, onSelect, itemClassName, iconClassName, highlightedIndex, listboxId } = data;
  const option = options[index];
  const isHighlighted = highlightedIndex === index;

  if (!option) return null;

  const optionId = listboxId ? `${listboxId}-option-${index}` : undefined;

  return (
    <div style={style} className="py-0.75">
      <SelectItem
        value={option.value}
        label={option.label}
        disabled={option.disabled}
        selected={selectedValue === option.value}
        highlighted={isHighlighted}
        onClick={onSelect}
        className={itemClassName}
        icon={option.icon}
        iconName={option.iconName}
        iconClassName={iconClassName}
        id={optionId}
      />
    </div>
  );
};

export const VirtualizedSelectList: React.FC<VirtualizedSelectListProps> = ({
  options,
  value,
  onSelect,
  size = "small",
  contentClassName = "",
  itemClassName = "",
  iconClassName = "",
  maxHeight = 300,
  itemHeight = 32,
  highlightedIndex,
  listboxId,
}) => {
  const listRef = useRef<FixedSizeList<ListItemData>>(null);
  const listData: ListItemData = {
    options,
    selectedValue: value,
    onSelect,
    itemClassName,
    iconClassName,
    highlightedIndex,
    listboxId,
  };

  const listHeight = Math.min(options.length * itemHeight, maxHeight);

  // Scroll to highlighted item using react-window's scrollToItem method
  // Using useLayoutEffect for synchronous scrolling before paint to reduce flicker
  useLayoutEffect(() => {
    if (highlightedIndex !== undefined && highlightedIndex >= 0 && listRef.current) {
      listRef.current.scrollToItem(highlightedIndex, "smart");
    }
  }, [highlightedIndex]);

  return (
    <div
      id={listboxId}
      role="listbox"
      aria-label="Options"
      className={cn(selectContentVariants({ size }), "py-0", contentClassName)}
    >
      {options.length > 0 ? (
        <FixedSizeList
          ref={listRef}
          height={listHeight}
          itemCount={options.length}
          itemSize={itemHeight}
          itemData={listData}
          width="100%"
          overscanCount={5}
        >
          {ListItem}
        </FixedSizeList>
      ) : (
        <div className="py-6 text-center text-muted-foreground text-sm">No options available</div>
      )}
    </div>
  );
};
