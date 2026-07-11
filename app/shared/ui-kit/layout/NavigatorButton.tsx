import type { Icon } from "@phosphor-icons/react";
import {
  BookOpen,
  Circle,
  DotsThree,
  File,
  Folder,
  Gear,
  GitPullRequest,
  Palette,
  Shapes,
  User,
} from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import type React from "react";
import { useRef, useState } from "react";
import { cn } from "../../lib/utils";
import { SelectList } from "../ui/SelectList";

interface SubItem {
  icon: Icon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

interface NavigatorButtonProps {
  iconName: string;
  isActive?: boolean;
  onClick?: () => void;
  subItems?: SubItem[];
  title?: string;
  className?: string;
  subMenuPosition?: "top" | "bottom";
  image?: string;
}

const buttonVariants = cva("flex items-center justify-center rounded-md transition-colors", {
  variants: {
    isActive: {
      true: "bg-neutral-100 dark:bg-neutral-950",
      false: "",
    },
    hasAvatar: {
      true: "p-2",
      false: "p-3",
    },
  },
  defaultVariants: {
    isActive: false,
    hasAvatar: false,
  },
});

const iconVariants = cva("size-4", {
  variants: {
    isActive: {
      true: "text-neutral-950 dark:text-neutral-100",
      false: "text-neutral-400 group-hover:text-primary-500 dark:text-neutral-500 dark:group-hover:text-primary-300",
    },
  },
  defaultVariants: {
    isActive: false,
  },
});

export const NavigatorButton: React.FC<NavigatorButtonProps> = ({
  iconName,
  isActive = false,
  onClick,
  subItems,
  title,
  className = "",
  subMenuPosition = "bottom",
  image,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Map icon names to Phosphor icons
  const iconMap: Record<string, Icon> = {
    File,
    Shapes,
    SwatchBook: Palette,
    Folder,
    BookOpen,
    GitPullRequest,
    Settings: Gear,
    Ellipsis: DotsThree,
    User,
  };
  const DynamicIcon = iconMap[iconName] || Circle;

  return (
    <div
      className={cn("group relative block", className)}
      onMouseEnter={() => setIsPopoverOpen(true)}
      onMouseLeave={() => setIsPopoverOpen(false)}
    >
      <button
        type="button"
        ref={buttonRef}
        className={buttonVariants({ isActive, hasAvatar: !!image })}
        title={title}
        onClick={onClick}
      >
        {image ? (
          <img
            src={image}
            alt="User avatar"
            className="size-7 rounded-full border-2 border-neutral-100 object-cover dark:border-neutral-950"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextElementSibling?.removeAttribute("style");
            }}
          />
        ) : null}
        <DynamicIcon className={cn(iconVariants({ isActive }), image && "hidden")} weight="duotone" />
      </button>

      {subItems && subItems.length > 0 && isPopoverOpen && (
        <div
          className={cn("absolute left-full z-30 min-w-40 pl-2.5", subMenuPosition === "top" ? "bottom-0" : "top-0")}
          ref={popoverRef}
        >
          <SelectList
            options={subItems.map((item, index) => ({
              value: index.toString(),
              label: item.label,
              icon: item.icon,
              disabled: false,
            }))}
            value={
              subItems.findIndex((item) => item.isActive) !== -1
                ? subItems.findIndex((item) => item.isActive).toString()
                : undefined
            }
            onSelect={(value) => {
              const selectedItem = subItems[parseInt(value, 10)];
              if (selectedItem) {
                selectedItem.onClick();
              }
            }}
            size="large"
            contentClassName="p-1 gap-1"
            itemClassName="font-medium whitespace-nowrap w-full flex items-center gap-2 text-left text-xs px-3 py-2 rounded transition-colors"
          />
        </div>
      )}
    </div>
  );
};
