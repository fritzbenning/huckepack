import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { forwardRef } from "react";
import RocketIcon from "@assets/3d-icons/rocket.avif";
import UniHatIcon from "@assets/3d-icons/uni-hat.avif";

const illustrationVariants = cva("", {
  variants: {
    size: {
      sm: "h-6 w-6",
      md: "h-8 w-8",
      lg: "h-12 w-12",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

export interface IllustrationProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof illustrationVariants> {
  name: "rocket" | "university";
  className?: string;
}

const illustrationMap = {
  rocket: RocketIcon,
  university: UniHatIcon,
};

const illustrationAltMap = {
  rocket: "Rocket",
  university: "UniHat",
};

export const Illustration = forwardRef<HTMLImageElement, IllustrationProps>(
  ({ name, size, className, ...props }, ref) => {
    const src = illustrationMap[name];
    const alt = illustrationAltMap[name];

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(illustrationVariants({ size }), className)}
        {...props}
      />
    );
  }
);

Illustration.displayName = "Illustration";

