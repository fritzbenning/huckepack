import type { Icon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";

const variants = cva("", {
  variants: {
    state: {
      active: "text-primary-500 dark:text-white",
      inactive: "text-neutral-400 hover:text-neutral-500 dark:text-neutral-500 dark:hover:text-neutral-400",
    },
  },
  defaultVariants: {
    state: "inactive",
  },
});

interface ToolProps {
  icon: Icon;
  onClick: () => void;
  isActive?: boolean;
}

export function Tool({ icon: Icon, onClick, isActive }: ToolProps) {
  return (
    <button type="button" className={variants({ state: isActive ? "active" : "inactive" })} onClick={onClick}>
      <Icon weight="duotone" className="size-5" />
    </button>
  );
}
