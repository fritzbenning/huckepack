import { cva } from "class-variance-authority";

export const switchVariants = cva(
  "relative inline-flex cursor-pointer items-center rounded-full border transition-colors focus:outline-none",
  {
    variants: {
      size: {
        small: "h-5 w-9",
        large: "h-6 w-11",
      },
      checked: {
        true: "border-primary-500 bg-primary-500 hover:border-primary-600 hover:bg-primary-600",
        false:
          "border-neutral-200 bg-neutral-100 hover:border-neutral-300 hover:bg-neutral-200 dark:border-neutral-600 dark:bg-neutral-750 dark:hover:border-neutral-500 dark:hover:bg-neutral-600",
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

export const switchToggleVariants = cva(
  "pointer-events-none inline-block rounded-full bg-white shadow-sm transition-transform",
  {
    variants: {
      size: {
        small: "size-3.5",
        large: "size-4",
      },
      checked: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        size: "small",
        checked: false,
        className: "translate-x-0.5",
      },
      {
        size: "small",
        checked: true,
        className: "translate-x-[1.125rem]",
      },
      {
        size: "large",
        checked: false,
        className: "translate-x-0.5",
      },
      {
        size: "large",
        checked: true,
        className: "translate-x-[1.375rem]",
      },
    ],
    defaultVariants: {
      size: "small",
      checked: false,
    },
  }
);

export const switchLabelVariants = cva("cursor-pointer select-none text-xs leading-tight transition-colors", {
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
