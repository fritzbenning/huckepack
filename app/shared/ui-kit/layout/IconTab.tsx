"use client";

import type { Icon } from "@phosphor-icons/react";
import Tab from "./Tab";

interface IconTabProps {
  to: string;
  icon: Icon;
  iconSize?: string;
  isActive?: boolean;
}

export default function IconTab({ to, icon: Icon, iconSize = "size-4", isActive = false }: IconTabProps) {
  return (
    <Tab to={to} variant="icon" isActive={isActive}>
      <Icon
        className={`${iconSize} h-full text-neutral-500 transition-colors group-hover:text-primary-500 dark:border-neutral-500/50 dark:text-neutral-400 dark:group-hover:text-white`}
        weight="duotone"
      />
    </Tab>
  );
}
