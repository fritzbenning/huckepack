import { cva, type VariantProps } from "class-variance-authority";

export const toolIndicatorButtonVariants = cva("group flex items-center gap-2 px-2.5 py-0.75", {
  variants: {
    hasOutput: {
      true: "cursor-pointer",
      false: "cursor-default",
    },
  },
});

export type ToolIndicatorButtonVariants = VariantProps<typeof toolIndicatorButtonVariants>;
