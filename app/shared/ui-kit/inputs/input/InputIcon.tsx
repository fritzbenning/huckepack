import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { type InputIconVariants, inputIconVariants } from "./inputIconVariants";

export interface InputIconProps extends InputIconVariants {
  icon: Icon | string;
  className?: string;
}

export function InputIcon({ icon, dimension = "small", className }: InputIconProps) {
  const iconClasses = cn(inputIconVariants({ dimension }), className);

  if (typeof icon === "string") {
    return (
      <span
        className={cn(
          iconClasses,
          "flex items-center justify-start px-0.5 font-medium text-neutral-400 opacity-75 dark:text-neutral-500"
        )}
      >
        {icon}
      </span>
    );
  }

  const IconComponent = icon;
  return <IconComponent className={iconClasses} weight="duotone" />;
}
