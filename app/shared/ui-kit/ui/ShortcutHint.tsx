export interface ShortcutHintProps {
  shortcutKey: string;
  label: string;
}

export function ShortcutHint({ shortcutKey, label }: ShortcutHintProps) {
  return (
    <span className="flex items-center gap-2">
      <kbd className="rounded border border-neutral-150 bg-white px-1.5 py-0.5 font-mono font-semibold text-3xs text-neutral-750 dark:border-neutral-800 dark:bg-neutral-850 dark:text-neutral-300">
        {shortcutKey}
      </kbd>
      <span className="text-sm">{label}</span>
    </span>
  );
}
