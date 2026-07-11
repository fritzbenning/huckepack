import { cva } from "class-variance-authority";
import type React from "react";

const treeNodeVariants = cva(
  "group relative flex w-full cursor-pointer items-center rounded-md py-1.5 pr-3 pl-2 text-xs",
  {
    variants: {
      variant: {
        component: "",
        element: "",
      },
      active: {
        true: "",
        false: "",
      },
      hidden: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "component",
        active: true,
        className: "bg-pink-100 text-pink-600 dark:bg-neutral-950 dark:text-pink-400",
      },
      {
        variant: "component",
        active: false,
        className: "text-pink-600 hover:bg-pink-50 dark:text-pink-400 dark:hover:bg-neutral-750/50",
      },
      {
        variant: "element",
        active: true,
        className: "bg-primary-50 text-primary-600 dark:bg-neutral-950 dark:text-white",
      },
      {
        variant: "element",
        active: false,
        className: "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-750/50",
      },
    ],
    defaultVariants: {
      variant: "element",
      active: false,
      hidden: false,
    },
  }
);

interface TreeItemContainerProps {
  isComponent: boolean;
  isActive: boolean;
  hidden?: boolean;
  onClick: (event: React.MouseEvent) => void;
  children: React.ReactNode;
}

export const TreeItemContainer: React.FC<TreeItemContainerProps> = ({
  isComponent,
  isActive,
  hidden = false,
  onClick,
  children,
}) => {
  return (
    <div
      className={treeNodeVariants({ variant: isComponent ? "component" : "element", active: isActive, hidden })}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      {children}
    </div>
  );
};
