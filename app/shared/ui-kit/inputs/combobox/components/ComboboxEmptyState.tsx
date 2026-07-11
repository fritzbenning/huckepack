export interface ComboboxEmptyStateProps {
  emptyText: string;
}

export function ComboboxEmptyState({ emptyText }: ComboboxEmptyStateProps) {
  return (
    <div aria-live="polite" className="py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
      {emptyText}
    </div>
  );
}
