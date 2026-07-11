import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";

const tabVariants = cva(
  "flex items-center gap-2 rounded-full px-4 py-2 font-medium font-semibold text-xs transition-colors",
  {
    variants: {
      state: {
        active: "dark:tex-white bg-white text-black shadow-md/4",
        inactive: "text-neutral-500 dark:text-neutral-400",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  }
);

export interface TabItem {
  id: string;
  label: string;
  icon?: Icon;
}

export interface TabsProps extends VariantProps<typeof tabVariants> {
  items: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  equalWidth?: boolean;
  tabWidth?: number;
  buttonRefs?: React.RefObject<HTMLButtonElement>[];
}

const Tabs: React.FC<TabsProps> = ({ items, activeTab, onTabChange, className, equalWidth, tabWidth, buttonRefs }) => {
  return (
    <div className={cn("flex gap-1 rounded-full bg-neutral-100 p-1 dark:bg-neutral-900", className)}>
      {items.map((item, index) => {
        const Icon = item.icon;
        const buttonRef = buttonRefs?.[index];
        return (
          <button
            ref={buttonRef}
            type="button"
            key={item.id}
            className={cn(tabVariants({ state: activeTab === item.id ? "active" : "inactive" }))}
            onClick={() => onTabChange(item.id)}
            style={tabWidth ? { width: `${tabWidth}px` } : equalWidth ? { flex: "1 1 0" } : undefined}
          >
            {Icon && <Icon className="size-3" weight="duotone" />}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
