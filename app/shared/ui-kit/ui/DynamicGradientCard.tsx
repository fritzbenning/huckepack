import { useCursorGradient } from "@hooks/application/useCursorGradient";
import type { ReactNode } from "react";

interface DynamicGradientCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DynamicGradientCard({ children, className = "", onClick }: DynamicGradientCardProps) {
  const { elementRef, handleMouseMove, cursorPosition } = useCursorGradient();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === "Enter" || e.key === " ") && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={onClick ? 0 : undefined}
      ref={elementRef as React.RefObject<HTMLDivElement>}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`group relative overflow-hidden ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div
        className="pointer-events-none absolute h-80 w-80 rounded-full bg-primary-200/20 opacity-0 blur-2xl transition-opacity group-hover:opacity-100 dark:bg-neutral-750/20"
        style={{
          transform: `translate(${cursorPosition.x - 50}%, ${cursorPosition.y - 50}%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
