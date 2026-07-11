import type { ComponentProps } from "react";

interface AddElementItemProps {
  name: string;
  icon: React.ComponentType<ComponentProps<"svg"> & { weight?: string }>;
  onClick: () => void;
}

export function AddElementItem({ name, icon: Icon, onClick }: AddElementItemProps) {
  return (
    <button
      type="button"
      key={name}
      className="group flex h-15 w-16 flex-col items-center justify-center gap-1 rounded-md text-center hover:bg-neutral-50 dark:hover:bg-neutral-950"
      onClick={onClick}
    >
      <Icon
        className="size-4.5 text-neutral-500 group-hover:text-primary-500 dark:text-neutral-400 dark:group-hover:text-neutral-300"
        weight="duotone"
      />
      <span className="text-neutral-500 text-xs group-hover:text-primary-500 dark:text-neutral-400 dark:group-hover:text-neutral-300">
        {name}
      </span>
    </button>
  );
}
