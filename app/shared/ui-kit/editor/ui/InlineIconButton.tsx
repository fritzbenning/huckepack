import type { Icon, IconWeight } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const iconSizeVariants = cva("", {
  variants: {
    size: {
      small: "size-3.5",
      medium: "size-4",
      large: "size-4.5",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

const buttonVariants = cva("group", {
  variants: {
    isActive: {
      true: "text-primary-500",
      false:
        "text-neutral-400 transition-colors hover:text-primary-500 dark:text-neutral-400 dark:hover:text-neutral-300",
    },
  },
  defaultVariants: {
    isActive: false,
  },
});

interface InlineIconButtonProps extends VariantProps<typeof iconSizeVariants> {
  icon: Icon;
  isActive?: boolean;
  onClick: (event: React.MouseEvent) => void;
  title: string;
  className?: string;
  weight?: IconWeight;
  asDiv?: boolean;
}

export const InlineIconButton: React.FC<InlineIconButtonProps> = ({
  icon: Icon,
  isActive = false,
  onClick,
  title,
  className = "",
  size,
  weight = "duotone",
  asDiv = false,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
    e.stopPropagation();
    onClick(e);
  };

  if (asDiv) {
    return (
      <div
        onClick={handleClick}
        title={title}
        className={buttonVariants({ isActive, className })}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
          }
        }}
      >
        <Icon className={iconSizeVariants({ size })} weight={weight} />
      </div>
    );
  }

  return (
    <button type="button" onClick={handleClick} title={title} className={buttonVariants({ isActive, className })}>
      <Icon className={iconSizeVariants({ size })} weight={weight} />
    </button>
  );
};
