import { ArrowUpIcon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import type React from "react";

const sendButtonVariants = cva(
  "group rounded-full bg-black opacity-80 transition-all hover:bg-neutral-950 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-10 disabled:hover:bg-black disabled:hover:opacity-50 dark:bg-white dark:hover:bg-neutral-100 dark:disabled:hover:bg-white",
  {
    variants: {
      size: {
        default: "p-1.25",
        large: "p-2",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

const iconVariants = cva("text-white dark:text-black", {
  variants: {
    size: {
      default: "size-3",
      large: "size-4",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

interface SendButtonProps {
  onClick: () => void;
  disabled: boolean;
  size?: "default" | "large";
}

export const SendButton: React.FC<SendButtonProps> = ({ onClick, disabled, size = "default" }) => {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={sendButtonVariants({ size })}>
      <ArrowUpIcon className={iconVariants({ size })} weight="bold" />
    </button>
  );
};
