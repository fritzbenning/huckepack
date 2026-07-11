export function ElseDivider() {
  return (
    <div className="flex items-center gap-2 py-4">
      <span className="h-0.25 grow rounded-full bg-neutral-300 dark:bg-neutral-750" />
      <div className="flex items-center gap-1">
        <span className="h-0.75 w-0.75 rounded-full bg-neutral-300 dark:bg-neutral-750" />
        <span className="h-0.75 w-0.75 rounded-full bg-neutral-300 dark:bg-neutral-750" />
      </div>
      <span className="h-0.25 grow rounded-full bg-neutral-300 dark:bg-neutral-750" />
    </div>
  );
}
