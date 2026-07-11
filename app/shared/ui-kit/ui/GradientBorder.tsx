import { cn } from "@lib/utils";
import type React from "react";

export interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  borderWidth?: string;
  borderRadius?: string;
  gradientColors?: string;
  animationDuration?: string;
}

const GradientBorder: React.FC<GradientBorderProps> = ({
  children,
  className,
  borderWidth = "p-0.75",
  borderRadius = "rounded-2xl",
  gradientColors = "from-primary-500 via-pink-500 to-amber-500",
  animationDuration = "8s",
}) => {
  const borderStyle = {
    padding: borderWidth,
  };

  const animationStyle =
    animationDuration !== "3s"
      ? {
          animationDuration: animationDuration,
        }
      : {};

  return (
    <div className={cn("relative", borderWidth, borderRadius, className)}>
      {/* Animated gradient border */}
      <div
        className={cn(
          "absolute inset-0 rounded-[inherit] opacity-35",
          `bg-gradient-to-r ${gradientColors}`,
          "animate-gradient-shift"
        )}
        style={{ ...borderStyle, ...animationStyle }}
      />

      {/* Content container */}
      <div className={cn("relative bg-white dark:bg-neutral-950", borderRadius)}>{children}</div>
    </div>
  );
};

export default GradientBorder;
