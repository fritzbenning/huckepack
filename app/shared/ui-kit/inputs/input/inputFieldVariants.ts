import { cva, type VariantProps } from "class-variance-authority";

export const inputFieldVariants = cva(
  "w-full text-neutral-600 text-xs leading-1 leading-none placeholder-neutral-500 focus:outline-none dark:text-neutral-400 dark:placeholder-neutral-400 [&:not(:placeholder-shown)]:text-neutral-600 dark:[&:not(:placeholder-shown)]:text-neutral-300",
  {
    variants: {
      icon: {
        true: "",
        false: "",
      },
      showUnitSelector: {
        true: "pr-14",
        false: "",
      },
      align: {
        left: "text-left",
        center: "text-center",
      },
      dimension: {
        small: "",
        medium: "",
        large: "",
      },
      tone: {
        subtle: "",
        emphasized: "",
        transparent: "",
      },
    },
    compoundVariants: [
      {
        dimension: "small",
        icon: true,
        className: "py-2 pr-1.5 pl-6",
      },
      {
        dimension: "medium",
        icon: true,
        className: "py-2 pr-2.5 pl-6.5",
      },
      {
        dimension: "large",
        icon: true,
        className: "py-3 pr-3 pl-6.5",
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
      showUnitSelector: false,
    },
  }
);

export type InputFieldVariants = VariantProps<typeof inputFieldVariants>;
