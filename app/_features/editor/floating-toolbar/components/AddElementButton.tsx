import { PlusIcon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";

const variants = cva("flex h-9 w-9 items-center justify-center rounded-full", {
  variants: {
    isActive: {
      true: "bg-primary-500 text-white",
      false:
        "bg-neutral-100 text-neutral-400 hover:bg-primary-100 hover:text-primary-500 dark:bg-neutral-950 dark:text-neutral-500 hover:dark:bg-black dark:hover:text-white",
    },
  },
});

interface AddElementButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export function AddElementButton({ isActive, onClick }: AddElementButtonProps) {
  return (
    <button type="button" className={variants({ isActive })} onClick={onClick}>
      <PlusIcon className="size-5" weight="regular" />
    </button>
  );
}
