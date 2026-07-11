export interface ComboboxLiveRegionProps {
  id: string;
  resultsCount: number;
  emptyText: string;
  isOpen: boolean;
}

export function ComboboxLiveRegion({ id, resultsCount, emptyText, isOpen }: ComboboxLiveRegionProps) {
  const resultsText =
    resultsCount === 0 ? emptyText : resultsCount === 1 ? "1 result available" : `${resultsCount} results available`;

  return (
    <div id={id} aria-live="polite" aria-atomic="true" className="sr-only">
      {isOpen && resultsText}
    </div>
  );
}
