import { CaretRight } from "@phosphor-icons/react";
import type React from "react";

interface TreeNodeChevronProps {
  isExpanded: boolean;
  onClick: (event: React.MouseEvent) => void;
}

export function TreeItemChevron({ isExpanded, onClick }: TreeNodeChevronProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="p-0.5text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white"
    >
      <CaretRight className={`current-color size-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
    </button>
  );
}
