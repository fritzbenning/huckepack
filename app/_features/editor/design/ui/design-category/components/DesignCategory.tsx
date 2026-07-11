import type { Id } from "@convex/_generated/dataModel";
import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import type { DesignPropertyKey } from "@editor/design/registry";
import type { CategoryConfig } from "@editor/design/ui/design-category/types";
import { DesignRule } from "@editor/design/ui/design-rule";
import { PlusIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { useDesignCategory } from "../hooks/useDesignCategory";
import { DesignCategoryDropdown } from "./DesignCategoryDropdown";
import { DesignCategorySection } from "./DesignCategorySection";

interface DesignPanelCategoryProps {
  category: CategoryConfig;
  presentProperties: Record<DesignPropertyKey, boolean>;
  projectId: Id<"projects">;
  fileId: Id<"files">;
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  astPosition: number | null;
}

export function DesignCategory({
  category,
  presentProperties,
  projectId,
  fileId,
  classes,
  astPosition,
}: DesignPanelCategoryProps) {
  const actionButtonRef = useRef<HTMLButtonElement | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const { presentRules, dropdownOptions, showActionButton } = useDesignCategory({
    category,
    presentProperties,
  });

  return (
    <DesignCategorySection
      title={category.name}
      onAction={showActionButton ? handleToggleDropdown : undefined}
      actionIcon={PlusIcon}
      actionButtonRef={actionButtonRef}
    >
      {presentRules.length > 0 && (
        <div className="flex flex-col gap-2 px-2.5">
          {presentRules.map((rule) => (
            <DesignRule
              key={rule.key}
              rule={rule}
              config={rule.config}
              projectId={projectId}
              fileId={fileId}
              classes={classes}
              astPosition={astPosition}
            />
          ))}
        </div>
      )}

      <DesignCategoryDropdown
        isOpen={isDropdownOpen}
        options={dropdownOptions}
        actionButtonRef={actionButtonRef}
        classes={classes}
        astPosition={astPosition}
        projectId={projectId}
        fileId={fileId}
        onClose={() => setIsDropdownOpen(false)}
      />
    </DesignCategorySection>
  );
}
