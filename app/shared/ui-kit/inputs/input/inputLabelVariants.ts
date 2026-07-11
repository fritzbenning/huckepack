import { cva, type VariantProps } from "class-variance-authority";
import type { InputDimension } from "./types";

export const inputLabelVariants = cva("mb-2 block font-medium text-neutral-750 leading-loose dark:text-neutral-300", {
  variants: {
    dimension: {
      small: "text-2xs",
      medium: "text-xs",
      large: "text-xs",
    },
  },
  defaultVariants: {
    dimension: "small",
  },
});

export type InputLabelVariants = VariantProps<typeof inputLabelVariants> & {
  dimension?: InputDimension;
};
