import { cva, type VariantProps } from "class-variance-authority";

export const textareaVariants = cva(
  "resize-y rounded-xl text-neutral-600 leading-relaxed placeholder-neutral-500 focus:text-black focus:outline-none dark:text-neutral-400 dark:placeholder-neutral-400 dark:focus:text-white",
  {
    variants: {
      dimension: {
        small: "min-h-20 p-2 text-xs",
        large:
          "min-h-40 border-1 border-neutral-200/75 p-5 text-base focus:border-neutral-200 dark:border-neutral-600/75 focus:dark:border-neutral-600",
      },
      tone: {
        subtle: "bg-white dark:bg-neutral-850",
        emphasized: "bg-neutral-100 dark:bg-neutral-950",
        transparent: "bg-transparent",
        glass: "bg-white/50 backdrop-blur-sm dark:bg-neutral-850/50",
      },
      icon: {
        true: "",
        false: "",
      },
      width: {
        full: "w-full",
        slim: "w-32",
      },
      align: {
        left: "text-left",
        center: "text-center",
      },
    },
    compoundVariants: [
      {
        dimension: "small",
        icon: true,
        className: "pr-2 pl-8",
      },
      {
        dimension: "large",
        icon: true,
        className: "pr-3 pl-9",
      },
    ],
    defaultVariants: {
      dimension: "small",
      tone: "subtle",
      icon: false,
    },
  }
);

export type TextareaVariants = VariantProps<typeof textareaVariants>;
