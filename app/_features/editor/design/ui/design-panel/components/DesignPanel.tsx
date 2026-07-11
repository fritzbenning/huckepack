import type { Id } from "@convex/_generated/dataModel";
import { useNodeClasses } from "@editor/class-inspector/hooks/useNodeClasses";
import { DESIGN_CATEGORY_REGISTRY } from "@editor/design/registry";
import { PlusIcon, QuestionIcon } from "@phosphor-icons/react";
import { AsideFooter } from "@shared/ui-kit/layout/AsideFooter";
import { ActionButton } from "@shared/ui-kit/ui/ActionButton";
import { DesignCategory } from "../../design-category/components/DesignCategory";
import { useModalTrigger } from "../hooks/useModalTrigger";
import { usePresentDesignRules } from "../hooks/usePresentDesignRules";

export default function DesignPanel({
  projectId,
  fileId,
  nodeId,
}: {
  projectId: Id<"projects">;
  fileId: Id<"files">;
  nodeId: string;
}) {
  const { astPosition, classes } = useNodeClasses(projectId, fileId, nodeId);
  const presentProperties = usePresentDesignRules(projectId, fileId, nodeId);

  const helpModal = useModalTrigger();

  return (
    <div className="grid h-full min-h-0 grid-rows-[1fr_auto]">
      <div className="min-h-0 overflow-y-auto">
        {DESIGN_CATEGORY_REGISTRY.map((category) => (
          <DesignCategory
            key={category.name}
            category={category}
            presentProperties={presentProperties}
            projectId={projectId}
            fileId={fileId}
            classes={classes}
            astPosition={astPosition}
          />
        ))}
      </div>
      <AsideFooter
        icon={QuestionIcon}
        onIconClick={() => helpModal.open("design-panel.help", "left")}
        iconRef={helpModal.ref}
      >
        <div className="flex items-center gap-2">
          <ActionButton icon={PlusIcon} onClick={() => {}}>
            Condition
          </ActionButton>
        </div>
      </AsideFooter>
    </div>
  );
}
