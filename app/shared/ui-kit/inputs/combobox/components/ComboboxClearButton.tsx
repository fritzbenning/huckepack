import { XIcon } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";

const comboboxClearButtonVariants = cva(
  "-translate-y-1/2 absolute top-1/2 z-10 h-4 w-4 shrink-0 opacity-50 hover:opacity-100",
  {
    variants: {
      tone: {
        subtle: "right-3",
        emphasized: "right-3",
        transparent: "right-0",
      },
    },
    defaultVariants: {
      tone: "emphasized",
    },
  }
);

export interface ComboboxClearButtonProps extends VariantProps<typeof comboboxClearButtonVariants> {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function ComboboxClearButton({ onClick, tone = "emphasized" }: ComboboxClearButtonProps) {
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.preventDefault()}
      className={comboboxClearButtonVariants({ tone })}
      type="button"
      aria-label="Clear selection"
    >
      <XIcon className="h-4 w-4 text-neutral-500 dark:text-neutral-400" weight="regular" />
    </button>
  );
}
