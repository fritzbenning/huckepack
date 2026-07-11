import { cn } from "@lib/utils";
import type { Icon, IconWeight } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { IconAction, type IconActionProps } from "./IconAction";
import InitialsAvatar from "./InitialsAvatar";

const asideItemVariants = cva("group flex w-full select-none items-center rounded-md text-xs transition-colors", {
  variants: {
    isActive: {
      true: "bg-primary-50 text-primary-600 dark:bg-neutral-950 dark:text-white",
      false: "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800",
    },
    disabled: {
      true: "pointer-events-none cursor-not-allowed opacity-50",
      false: "",
    },
    avatar: {
      true: "px-2 py-2",
      false: "py-1.5 pr-2 pl-2",
    },
  },
});

interface AsideItemProps extends VariantProps<typeof asideItemVariants> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  icon?: Icon;
  iconWeight?: IconWeight;
  primaryAction?: Omit<IconActionProps, "size"> & { size?: IconActionProps["size"] };
  secondaryAction?: Omit<IconActionProps, "size"> & { size?: IconActionProps["size"] };
  avatar?: boolean;
  isActive?: boolean;
}

const AsideItem: React.FC<AsideItemProps> = ({
  children,
  className,
  onClick,
  href,
  disabled = false,
  icon: Icon,
  iconWeight = "duotone",
  primaryAction,
  secondaryAction,
  avatar = false,
  isActive = false,
}) => {
  const content = (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        {Icon && <Icon weight={iconWeight} className="current-color size-3.5" />}
        {avatar && <InitialsAvatar name={children} />}
        <span className="flex h-4.5 flex-1 items-center font-medium">{children}</span>
      </div>
      <div className="flex items-center gap-1.5 pr-0.5">
        {secondaryAction && (
          <IconAction
            size={secondaryAction.size || "xs"}
            className={cn("opacity-0 group-hover:opacity-100", secondaryAction.className)}
            asDiv={!!onClick || !!href}
            {...secondaryAction}
          />
        )}
        {primaryAction && (
          <IconAction
            size={primaryAction.size || "xs"}
            className={cn("opacity-0 group-hover:opacity-100", primaryAction.className)}
            asDiv={!!onClick || !!href}
            {...primaryAction}
          />
        )}
      </div>
    </div>
  );

  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  if (href && !disabled && !isActive) {
    return (
      <Link
        to={href}
        className={cn(asideItemVariants({ isActive, disabled, avatar }), className)}
        onClick={handleClick}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={cn(asideItemVariants({ isActive, disabled, avatar }), className)}
      onClick={handleClick}
    >
      {content}
    </button>
  );
};

export default AsideItem;
