import { cva, type VariantProps } from "class-variance-authority";

export const toolIndicatorCaretVariants = cva("transition-transform", {
  variants: {
    expanded: {
      true: "rotate-180",
      false: "",
    },
    kind: {
      trigger: "size-3",
      overlay: "absolute inset-0 size-3.5 opacity-0 transition-all group-hover:opacity-100",
    },
  },
  defaultVariants: {
    kind: "trigger",
  },
});

export type ToolIndicatorCaretVariants = VariantProps<typeof toolIndicatorCaretVariants>;
