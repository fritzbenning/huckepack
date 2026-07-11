export interface ComboboxOverflowMessageProps {
  displayedCount: number;
  totalCount: number;
}

export function ComboboxOverflowMessage({ displayedCount, totalCount }: ComboboxOverflowMessageProps) {
  return (
    <div
      aria-live="polite"
      className="border-neutral-100 border-t px-3 py-2 text-xs text-neutral-500 dark:border-neutral-850 dark:text-neutral-400"
    >
      Showing {displayedCount} of {totalCount} results. Type to search for more...
    </div>
  );
}
