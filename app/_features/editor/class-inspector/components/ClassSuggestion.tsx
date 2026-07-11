import { cn } from "@lib/utils";
import { Sparkle, X } from "@phosphor-icons/react";
import { ClassLabel } from "./ClassLabel";

interface ClassSuggestionProps {
  suggestion: string;
  onClick: (suggestion: string) => void;
  onRemove?: (suggestion: string) => void;
}

export function ClassSuggestion({ suggestion, onClick, onRemove }: ClassSuggestionProps) {
  const handleRemove = (e: React.MouseEvent) => {
    console.log("[ClassSuggestion] Remove button clicked", { suggestion, onRemove: !!onRemove });
    e.stopPropagation();
    e.preventDefault();
    if (onRemove) {
      console.log("[ClassSuggestion] Calling onRemove handler");
      onRemove(suggestion);
    } else {
      console.warn("[ClassSuggestion] onRemove handler not provided");
    }
  };

  return (
    <div
      className={cn(
        "group relative flex h-3.25 w-full shrink-0 items-center gap-1 rounded-md px-2 py-3 font-mono text-2xs",
        "bg-blue-50 text-blue-700 dark:bg-neutral-800 dark:text-blue-300"
      )}
    >
      <button
        type="button"
        onClick={() => onClick(suggestion)}
        className={cn(
          "flex flex-1 items-center gap-1 text-left transition-all",
          "hover:text-blue-800 dark:hover:text-blue-200"
        )}
      >
        <Sparkle size={12} className="shrink-0 opacity-70" weight="fill" />
        <ClassLabel token={suggestion} />
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={handleRemove}
          className={cn(
            "shrink-0 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100",
            "hover:bg-blue-200 dark:hover:bg-blue-900/30"
          )}
          title="Remove suggestion"
        >
          <X size={10} weight="bold" />
        </button>
      )}
    </div>
  );
}
