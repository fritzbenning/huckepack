import { cn } from "@lib/utils";
import type { Icon, IconWeight } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const notificationVariants = cva("flex items-center gap-1.5 font-semibold text-xs", {
  variants: {
    severity: {
      success: "text-emerald-600 dark:text-emerald-400",
      error: "text-red-600 dark:text-red-400",
      warning: "text-amber-600 dark:text-amber-400",
      info: "text-blue-600 dark:text-blue-400",
      neutral: "text-neutral-750 dark:text-neutral-300",
    },
  },
  defaultVariants: {
    severity: "neutral",
  },
});

const iconSizeVariants = cva("", {
  variants: {
    size: {
      small: "size-4",
      medium: "size-5",
      large: "size-6",
    },
  },
  defaultVariants: {
    size: "small",
  },
});

export interface InlineNotificationProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof notificationVariants> {
  icon?: Icon;
  iconWeight?: IconWeight;
  iconSize?: "small" | "medium" | "large";
  children: React.ReactNode;
}

export function InlineNotification({
  icon: IconComponent,
  severity,
  iconWeight = "duotone",
  iconSize = "small",
  children,
  className,
  ...props
}: InlineNotificationProps) {
  return (
    <p className={cn(notificationVariants({ severity }), className)} {...props}>
      {IconComponent && <IconComponent className={iconSizeVariants({ size: iconSize })} weight={iconWeight} />}
      {children}
    </p>
  );
}
