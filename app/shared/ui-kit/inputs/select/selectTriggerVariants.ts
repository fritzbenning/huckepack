import { cva, type VariantProps } from "class-variance-authority";

export const selectTriggerVariants = cva(
  "w-full cursor-pointer text-neutral-600 placeholder-neutral-500 focus:outline-none dark:text-neutral-400 dark:placeholder-neutral-400 [&:not(:placeholder-shown)]:text-neutral-600 dark:[&:not(:placeholder-shown)]:text-neutral-300",
  {
    variants: {
      icon: {
        true: "",
        false: "",
      },
      align: {
        left: "text-left",
        center: "text-center",
      },
      dimension: {
        tiny: "text-2xs",
        small: "text-2xs",
        medium: "text-xs",
        large: "text-xs",
      },
      tone: {
        subtle: "",
        emphasized: "",
        transparent: "",
      },
    },
    compoundVariants: [
      {
        dimension: "tiny",
        icon: true,
        className: "py-1.5 pr-2 pl-6",
      },
      {
        dimension: "small",
        icon: true,
        className: "py-2 pr-2 pl-6.5",
      },
      {
        dimension: "medium",
        icon: true,
        className: "py-2 pr-2 pl-6.5",
      },
      {
        dimension: "large",
        icon: true,
        className: "py-3 pr-2 pl-6.5",
      },
      {
        dimension: "tiny",
        icon: false,
        className: "px-2 py-1.5 pr-8",
      },
      {
        dimension: "small",
        icon: false,
        className: "px-2 py-2",
      },
      {
        dimension: "medium",
        icon: false,
        className: "px-2.5 py-2",
      },
      {
        dimension: "large",
        icon: false,
        className: "px-3 py-3",
      },
      {
        tone: "transparent",
        className: "p-0",
      },
    ],
    defaultVariants: {
      dimension: "small",
      tone: "subtle",
      icon: false,
      align: "left",
    },
  }
);

export type SelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;
