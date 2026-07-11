import { cn } from "@lib/utils";
import type { Icon, IconWeight } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { forwardRef } from "react";
import { Link } from "react-router-dom";

const buttonVariants = cva(
  "flex items-center justify-center rounded-md border-1 font-semibold transition-colors duration-150",
  {
    variants: {
      severity: {
        primary: "",
        secondary: "",
        error: "",
      },
      variant: {
        solid: "",
        outline: "border-1 bg-transparent",
      },
      size: {
        tiny: "h-7 gap-1.5 px-2 text-2xs",
        small: "h-7.5 gap-1.5 px-2.5 text-2xs",
        large: "h-8.5 gap-2 px-3 text-xs",
        hero: "h-9.5 gap-10 px-4 text-sm",
      },
      iconOnly: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        severity: "primary",
        variant: "solid",
        className:
          "border-black/10 bg-black text-white hover:bg-neutral-950 dark:border-white/20 dark:bg-white dark:text-black dark:hover:bg-neutral-100",
      },
      {
        severity: "primary",
        variant: "outline",
        className:
          "border-black/20 bg-transparent text-black hover:bg-black/5 dark:border-white/30 dark:bg-transparent dark:text-white dark:hover:bg-white/10",
      },
      {
        severity: "secondary",
        variant: "solid",
        className:
          "border-white/50 bg-neutral-500 text-white hover:bg-neutral-600 dark:border-white/10 dark:bg-neutral-750 dark:hover:bg-neutral-600",
      },
      {
        severity: "secondary",
        variant: "outline",
        className:
          "border-neutral-300 bg-white/50 text-neutral-750 hover:bg-neutral-50 dark:border-neutral-750 dark:bg-transparent dark:text-white dark:hover:bg-neutral-950",
      },
      {
        severity: "error",
        variant: "solid",
        className:
          "border-white/50 bg-rose-600 text-white hover:bg-rose-700 dark:border-white/10 dark:bg-rose-800 dark:hover:bg-rose-700",
      },
      {
        severity: "error",
        variant: "outline",
        className:
          "border-rose-500 bg-white/50 text-rose-500 hover:bg-rose-50 dark:border-rose-700 dark:bg-transparent dark:text-rose-400 dark:hover:bg-rose-950",
      },
      // Icon-only variants with roseuced horizontal padding
      {
        iconOnly: true,
        size: "tiny",
        className: "px-1.5",
      },
      {
        iconOnly: true,
        size: "small",
        className: "px-2",
      },
      {
        iconOnly: true,
        size: "large",
        className: "px-2.5",
      },
      {
        iconOnly: true,
        size: "hero",
        className: "px-3",
      },
    ],
    defaultVariants: {
      severity: "secondary",
      variant: "solid",
      size: "small",
      iconOnly: false,
    },
  }
);

const iconSizeVariants = cva("", {
  variants: {
    size: {
      tiny: "size-3",
      small: "size-3.5",
      large: "size-4",
      hero: "size-4",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  className?: string;
  href?: string;
  icon?: Icon;
  iconWeight?: IconWeight;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, className, severity, variant, size, disabled, href, icon, iconOnly, iconWeight = "regular", ...props },
    ref
  ) => {
    const isIconOnly = iconOnly || (icon && !children);
    const IconComponent = icon;

    const buttonClassName = cn(
      buttonVariants({ severity, variant, size, iconOnly: isIconOnly }),
      disabled && "pointer-events-none opacity-25",
      className
    );

    const iconSizeClass = iconSizeVariants({ size: size || "small" });

    const buttonContent = (
      <>
        {IconComponent && <IconComponent className={iconSizeClass} weight={iconWeight} />}
        {children}
      </>
    );

    if (href) {
      return (
        <Link
          to={href}
          className={buttonClassName}
          {...(disabled && { onClick: (e) => e.preventDefault() })}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {buttonContent}
        </Link>
      );
    }

    return (
      <button ref={ref} className={buttonClassName} disabled={disabled} {...props}>
        {buttonContent}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
