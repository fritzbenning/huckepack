import { cva, type VariantProps } from "class-variance-authority";

export const inputRootVariants = cva(
  "group relative flex items-center gap-1.5 border border-transparent focus-within:border-neutral-300 hover:border-neutral-200 focus-within:hover:border-neutral-300 dark:hover:border-neutral-750 dark:focus-within:border-neutral-600 dark:focus-within:hover:border-neutral-600",
  {
    variants: {
      dimension: {
        small: "h-7 rounded-md",
        medium: "rounded-md",
        large: "rounded-lg",
      },
      tone: {
        subtle: "bg-white dark:bg-neutral-850",
        emphasized: "bg-neutral-100 dark:bg-neutral-900",
        transparent: "bg-transparent",
      },
      width: {
        full: "w-full",
        slim: "w-8",
      },
      error: {
        true: "border-red-500 bg-red-50 focus-within:border-red-500 hover:border-red-500 focus-within:hover:border-red-500 dark:border-red-500 dark:bg-red-950/20 dark:hover:border-red-500 dark:focus-within:border-red-500 dark:focus-within:hover:border-red-500",
        false: "",
      },
      disabled: {
        true: "opacity-50",
        false: "",
      },
    },
    compoundVariants: [
      {
        tone: "transparent",
        className:
          "border-0 focus-within:border-0 hover:border-0 focus-within:hover:border-0 dark:hover:border-0 dark:focus-within:border-0 dark:focus-within:hover:border-0",
      },
      {
        tone: "transparent",
        error: true,
        className:
          "border-red-500 bg-red-50 focus-within:border-red-500 hover:border-red-500 focus-within:hover:border-red-500 dark:border-red-500 dark:bg-red-950/20 dark:hover:border-red-500 dark:focus-within:border-red-500 dark:focus-within:hover:border-red-500",
      },
      {
        tone: "subtle",
        error: true,
        className: "bg-red-50 dark:bg-red-950/20",
      },
      {
        tone: "emphasized",
        error: true,
        className: "bg-red-50 dark:bg-red-950/20",
      },
    ],
    defaultVariants: {
      dimension: "small",
      tone: "subtle",
      width: "full",
      error: false,
      disabled: false,
    },
  }
);

export type InputRootVariants = VariantProps<typeof inputRootVariants>;
