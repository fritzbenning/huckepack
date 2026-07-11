import { CaretDown, CaretRight } from "@phosphor-icons/react";
import type React from "react";

interface TreeNodeChevronProps {
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpanded: (event: React.MouseEvent) => void;
}

export const TreeNodeChevron: React.FC<TreeNodeChevronProps> = ({ isExpanded, isSelected, onToggleExpanded }) => {
  const iconClassName = `w-3 h-3 ${isSelected ? "dark:text-primary-300 text-primary-500" : "text-neutral-600 dark:text-neutral-400"}`;

  return (
    <button type="button" onClick={onToggleExpanded} className="rounded p-0.5 hover:bg-white dark:hover:bg-neutral-750">
      {isExpanded ? (
        <CaretDown className={iconClassName} weight="duotone" />
      ) : (
        <CaretRight className={iconClassName} weight="duotone" />
      )}
    </button>
  );
};
