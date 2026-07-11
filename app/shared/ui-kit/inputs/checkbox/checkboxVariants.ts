import { cva } from "class-variance-authority";

export const checkboxVariants = cva(
  "flex cursor-pointer items-center justify-center rounded-xs border transition-colors focus:outline-none",
  {
    variants: {
      size: {
        small: "h-4 w-4",
        large: "h-5 w-5",
      },
      checked: {
        true: "border-primary-500 bg-primary-500 text-white hover:border-primary-600 hover:bg-primary-600",
        false:
          "border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-600 dark:bg-neutral-850 dark:hover:border-neutral-500",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      size: "small",
      checked: false,
      disabled: false,
    },
  }
);

export const checkboxLabelVariants = cva("cursor-pointer select-none text-xs leading-tight transition-colors", {
  variants: {
    size: {
      small: "text-xs",
      large: "text-sm",
    },
    disabled: {
      true: "cursor-not-allowed opacity-50",
      false: "text-neutral-750 hover:text-primary-500 dark:text-neutral-300 dark:hover:text-primary-400",
    },
  },
  defaultVariants: {
    size: "small",
    disabled: false,
  },
});
