import type React from "react";

interface AsideHeaderProps {
  tabsSlot?: React.ReactNode;
  children?: React.ReactNode;
}

export function AsideHeader({ tabsSlot, children }: AsideHeaderProps) {
  return (
    <div className="border-neutral-100 border-b bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
      <div className="h-12">{children}</div>
      {tabsSlot && <div className="border-neutral-150/75 border-t dark:border-neutral-800">{tabsSlot}</div>}
    </div>
  );
}
