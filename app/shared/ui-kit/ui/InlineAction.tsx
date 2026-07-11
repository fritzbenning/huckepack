import { PlusIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

interface InlineActionProps {
  onClick: () => void;
  label: string;
  icon?: ReactNode;
  className?: string;
  wrapperClassName?: string;
}

export function InlineAction({
  onClick,
  label,
  icon = <PlusIcon className="size-3" />,
  className,
  wrapperClassName,
}: InlineActionProps) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      className={
        className ||
        "flex h-3.25 items-center gap-1 text-neutral-500 transition-colors hover:text-neutral-750 dark:text-neutral-400 dark:hover:text-neutral-200"
      }
    >
      {icon}
      <span className="text-2xs">{label}</span>
    </button>
  );

  if (wrapperClassName) {
    return <div className={wrapperClassName}>{button}</div>;
  }

  return button;
}
