import { cn } from "@lib/utils";
import { extractInitials } from "@shared/utils/format";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const avatarVariants = cva(
  "flex items-center justify-center border-1 border-primary-200 bg-gradient-to-br bg-primary-100 font-extrabold text-primary-500 leading-none backdrop-blur-xl dark:border-primary-500/50 dark:bg-primary-500/20 dark:text-primary-400",
  {
    variants: {
      size: {
        sm: "size-5 rounded-xs text-5xs",
        md: "size-6 rounded-sm text-3xs",
        lg: "size-8 rounded-md text-xs",
        xl: "size-10 rounded-md text-sm",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

interface InitialsAvatarProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof avatarVariants> {
  name: string | React.ReactNode;
  className?: string;
}

const InitialsAvatar: React.FC<InitialsAvatarProps> = ({ name, size, className, ...props }) => {
  const initials = extractInitials(name);

  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {initials}
    </div>
  );
};

export default InitialsAvatar;
