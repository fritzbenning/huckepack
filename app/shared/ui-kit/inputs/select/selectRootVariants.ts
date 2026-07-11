import { cva, type VariantProps } from "class-variance-authority";

export const selectRootVariants = cva("group flex items-center gap-2", {
  variants: {
    dimension: {
      tiny: "h-6 rounded-md",
      small: "h-7 rounded-md",
      medium: "rounded-md",
      large: "rounded-lg",
    },
    height: {
      auto: "h-auto",
      default: "",
    },
    tone: {
      subtle:
        "border border-transparent bg-white focus-within:border-neutral-300 hover:border-neutral-200 focus-within:hover:border-neutral-300 dark:bg-neutral-850 dark:hover:border-neutral-750 dark:focus-within:border-neutral-600 dark:focus-within:hover:border-neutral-600",
      emphasized:
        "border border-transparent bg-neutral-100 focus-within:border-neutral-300 hover:border-neutral-200 focus-within:hover:border-neutral-300 dark:bg-neutral-900 dark:hover:border-neutral-750 dark:focus-within:border-neutral-600 dark:focus-within:hover:border-neutral-600",
      transparent: "border-none bg-transparent",
    },
    width: {
      full: "w-full",
      slim: "w-8",
    },
  },
  defaultVariants: {
    dimension: "small",
    height: "default",
    tone: "subtle",
    width: "full",
  },
});

export type SelectRootVariants = VariantProps<typeof selectRootVariants>;
