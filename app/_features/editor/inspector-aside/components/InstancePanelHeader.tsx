import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import Button from "@shared/ui-kit/ui/Button";
import { LinkBreakIcon, PencilSimpleIcon } from "@phosphor-icons/react";

interface InstancePanelHeaderProps {
  onEditMaster: () => void;
}

export function InstancePanelHeader({ onEditMaster }: InstancePanelHeaderProps) {
  return (
    <AsideSection>
      <div className="flex w-full items-center gap-2">
        <Button onClick={onEditMaster} icon={PencilSimpleIcon} size="tiny" className="flex-1">
          Edit Master
        </Button>
        <Button icon={LinkBreakIcon} className="flex-1" disabled>
          Detach
        </Button>
      </div>
    </AsideSection>
  );
}

