import { cn } from "@lib/utils";
import type { Icon, IconWeight } from "@phosphor-icons/react";
import { X } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { forwardRef } from "react";

const iconActionVariants = cva(
  "group rounded text-neutral-400 transition-all hover:text-primary-500 focus:text-primary-500 focus:outline-none dark:text-neutral-400 dark:focus:text-white dark:hover:text-white",
  {
    variants: {
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

const iconSizeVariants = cva("", {
  variants: {
    size: {
      xs: "size-3.5",
      sm: "size-4",
      md: "size-4.5",
      lg: "size-5",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export interface IconActionProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">,
    VariantProps<typeof iconActionVariants> {
  icon?: Icon;
  onClick: (event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  weight?: IconWeight;
  asDiv?: boolean;
}

export const IconAction = forwardRef<HTMLButtonElement | HTMLDivElement, IconActionProps>(
  ({ icon: Icon = X, size = "sm", onClick, className, title, weight = "regular", asDiv = false, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
      e.stopPropagation();
      onClick(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
      }
    };

    if (asDiv) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          className={cn(iconActionVariants({ size }), "cursor-pointer", className)}
          title={title}
        >
          <Icon className={cn(iconSizeVariants({ size }))} weight={weight} />
        </div>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        onClick={handleClick}
        className={cn(iconActionVariants({ size }), className)}
        title={title}
        {...props}
      >
        <Icon className={cn(iconSizeVariants({ size }))} weight={weight} />
      </button>
    );
  }
);

IconAction.displayName = "IconAction";
