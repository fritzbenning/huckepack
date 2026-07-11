import { cva, type VariantProps } from "class-variance-authority";

export const inputIconVariants = cva(
  "-translate-y-1/2 absolute top-1/2 left-1.5 z-10 shrink-0 text-neutral-400 dark:text-neutral-500",
  {
    variants: {
      dimension: {
        tiny: "size-3",
        small: "size-3.5",
        medium: "size-4",
        large: "size-4.5",
      },
    },
    defaultVariants: {
      dimension: "small",
    },
  }
);

export type InputIconVariants = VariantProps<typeof inputIconVariants>;
