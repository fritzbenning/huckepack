import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { SectionTitle } from "@shared/ui-kit/editor/SectionTitle";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const designCategoryVariants = cva(
  "flex min-w-0 flex-col gap-3 border-neutral-100 border-b px-1.5 py-4 dark:border-neutral-800",
  {
    variants: {},
    defaultVariants: {},
  }
);

interface DesignCategoryProps extends VariantProps<typeof designCategoryVariants> {
  title: string;
  onAction?: () => void;
  actionIcon?: Icon;
  children: ReactNode;
  className?: string;
  actionButtonRef?: React.RefObject<HTMLButtonElement | null>;
}

export function DesignCategorySection({
  title,
  onAction,
  actionIcon,
  children,
  className,
  actionButtonRef,
}: DesignCategoryProps) {
  return (
    <div className={cn(designCategoryVariants(), className)}>
      <SectionTitle
        className="flex h-3 items-center px-2.5"
        onClick={onAction}
        spacing="none"
        actionIcon={actionIcon}
        actionButtonRef={actionButtonRef}
      >
        {title}
      </SectionTitle>
      {children}
    </div>
  );
}
