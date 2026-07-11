import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import type React from "react";

interface TabItem {
  id: string;
  icon: Icon;
  label: string;
}

interface TabsProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  tabs: TabItem[];
}

const tabVariants = cva(
  "flex h-6 items-center justify-center gap-1.5 rounded-md px-2 font-semibold text-2xs leading-tight",
  {
    variants: {
      state: {
        active: "bg-neutral-150 text-neutral-850 dark:bg-neutral-800 dark:text-white",
        inactive: "text-neutral-450 hover:text-neutral-550 dark:text-neutral-450 hover:dark:text-neutral-400",
      },
    },
    defaultVariants: {
      state: "inactive",
    },
  }
);

const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="flex w-full gap-1 p-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            type="button"
            key={tab.id}
            className={cn(tabVariants({ state: activeTab === tab.id ? "active" : "inactive" }))}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon className="size-3.5" weight="duotone" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
