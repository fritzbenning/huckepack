import type React from "react";

interface DesignRuleBodyProps {
  children: React.ReactNode;
  className?: string;
  disablePadding?: boolean;
}

export function DesignRuleBody({ children }: DesignRuleBodyProps) {
  return <div className="flex flex-1 gap-4 px-2">{children}</div>;
}

