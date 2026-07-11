import { XIcon } from "@phosphor-icons/react";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import { Tooltip } from "@shared/ui-kit/ui/Tooltip";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const threadTabVariants = cva(
  "flex h-6 shrink-0 items-center gap-1 whitespace-nowrap rounded-sm pr-1.5 pl-2 text-2xs leading-loose transition-colors",
  {
    variants: {
      isActive: {
        true: "bg-neutral-200 dark:bg-neutral-950",
        false: "text-neutral-500 hover:text-black dark:text-neutral-500 dark:hover:text-white",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

interface ThreadTabProps extends VariantProps<typeof threadTabVariants> {
  thread: {
    _id: string;
    title?: string;
  };
  onClick: () => void;
  onDelete: () => void;
  className?: string;
}

export const ThreadTab: React.FC<ThreadTabProps> = ({ thread, isActive, onClick, onDelete, className }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <Tooltip content={thread.title}>
      <button type="button" onClick={onClick} className={threadTabVariants({ isActive, className })}>
        <span className="max-w-20 truncate">{thread.title}</span>
        <InlineIconButton
          icon={XIcon}
          onClick={handleDelete}
          title="Delete Thread"
          size="small"
          weight="regular"
          asDiv={true}
        />
      </button>
    </Tooltip>
  );
};
