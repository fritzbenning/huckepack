import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { SectionTitle } from "@shared/ui-kit/editor/SectionTitle";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

const asideSectionVariants = cva("flex min-w-0 flex-col px-1.5", {
  variants: {
    divider: {
      true: "border-neutral-100 border-b last:border-b-0 dark:border-neutral-800",
      false: "",
    },
    hasTitle: {
      true: "pt-3 pb-4.5",
      false: "py-4.5",
    },
    titleGap: {
      true: "gap-2",
      false: "gap-1",
    },
  },
  defaultVariants: {
    divider: true,
    hasTitle: false,
    titleGap: true,
  },
});

const contentVariants = cva("flex", {
  variants: {
    contentDirection: {
      row: "",
      col: "flex-col",
    },
    indentedContent: {
      true: "px-2.5",
      false: "",
    },
    contentGap: {
      large: "gap-3",
      small: "gap-2",
      tiny: "gap-0.75",
      none: "gap-0",
    },
  },
  defaultVariants: {
    contentDirection: "col",
    indentedContent: true,
    contentGap: "large",
  },
});

interface AsideSectionProps extends VariantProps<typeof asideSectionVariants>, VariantProps<typeof contentVariants> {
  title?: string;
  onAction?: () => void;
  actionIcon?: Icon;
  children: ReactNode;
  className?: string;
  editableTitle?: boolean;
  onTitleRename?: (newName: string) => void;
  titleNormalCase?: boolean;
}

export function AsideSection({
  title,
  titleGap = true,
  onAction,
  actionIcon,
  children,
  className,
  indentedContent = true,
  contentDirection = "col",
  contentGap = "large",
  divider = true,
  editableTitle = false,
  onTitleRename,
  titleNormalCase = false,
}: AsideSectionProps) {
  return (
    <div className={cn(asideSectionVariants({ divider, hasTitle: !!title, titleGap }), className)}>
      {title && (
        <SectionTitle
          className="flex min-h-5 items-center px-2.5"
          onClick={onAction}
          spacing="none"
          actionIcon={actionIcon}
          editable={editableTitle}
          onRename={onTitleRename}
          normalCase={titleNormalCase}
        >
          {title}
        </SectionTitle>
      )}
      <div className={contentVariants({ contentDirection, indentedContent, contentGap })}>{children}</div>
    </div>
  );
}
