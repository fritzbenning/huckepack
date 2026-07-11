import { cva, type VariantProps } from "class-variance-authority";

export const toolIndicatorRootVariants = cva(
  ["flex flex-col", "rounded-md border", "text-xs leading-loose", "transition-all"].join(" "),
  {
    variants: {
      state: {
        "input-streaming": [
          "border-neutral-150 bg-neutral-50 text-neutral-750",
          "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
        ].join(" "),
        "input-available": [
          "border-neutral-150 bg-neutral-50 text-neutral-750",
          "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200",
        ].join(" "),
        "output-available": [
          "border-neutral-150 bg-neutral-50 text-neutral-500",
          "dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:text-neutral-400",
        ].join(" "),
        "output-error": [
          "border-red-200 bg-red-50 text-red-700",
          "dark:border-red-800 dark:bg-red-950 dark:text-red-300",
        ].join(" "),
      },
    },
  }
);

export type ToolIndicatorRootVariants = VariantProps<typeof toolIndicatorRootVariants>;
export type ToolIndicatorState = NonNullable<ToolIndicatorRootVariants["state"]>;
