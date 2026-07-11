import type { ReactNode } from "react";

interface AnimatedExpandableProps {
  children: ReactNode;
  isOpen: boolean;
  className?: string;
  contentClassName?: string;
  duration?: number;
  maxHeight?: string;
}

export function AnimatedExpandable({
  children,
  isOpen,
  className,
  contentClassName,
  duration = 400,
  maxHeight = "1000px",
}: AnimatedExpandableProps) {
  return (
    <div
      className={`overflow-hidden transition-all ease-in-out ${className ?? ""}`}
      style={{
        maxHeight: isOpen ? maxHeight : "0px",
        opacity: isOpen ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
