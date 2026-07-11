import type React from "react";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
}

export const ShimmerText: React.FC<ShimmerTextProps> = ({ children, className = "" }) => {
  return (
    <span
      className={`animate-shimmer bg-[length:200%_100%] bg-gradient-to-r from-neutral-600 via-neutral-200 to-neutral-600 bg-clip-text text-transparent dark:from-neutral-300 dark:via-white dark:to-neutral-300 ${className}`}
    >
      {children}
    </span>
  );
};
