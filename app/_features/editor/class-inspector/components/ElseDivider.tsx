export function ElseDivider() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-px flex-1 bg-neutral-150 dark:bg-neutral-800" />
      <span className="flex h-0 items-center font-medium text-2xs text-neutral-400 dark:text-neutral-600">else</span>
      <div className="h-px flex-1 bg-neutral-150 dark:bg-neutral-800" />
    </div>
  );
}
