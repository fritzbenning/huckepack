import type { Id } from "@convex/_generated/dataModel";
import { CardholderIcon, PlusIcon, QuestionIcon } from "@phosphor-icons/react";
import { useFileManagerStore } from "@project/file-manager";
import { openPinnedModal } from "@shared/pinned-modal";
import { AsideFooter } from "@shared/ui-kit/layout/AsideFooter";
import { ActionButton } from "@shared/ui-kit/ui/ActionButton";
import IdlePlaceholder from "@shared/ui-kit/ui/IdlePlaceholder";
import { useRef } from "react";
import { useProperties } from "../hooks/useProperties";
import { Property } from "./Property";

export function PropertyPanel({ projectId, fileId }: { projectId: Id<"projects">; fileId: Id<"files"> }) {
  const properties = useFileManagerStore((state) => state.files[fileId].properties, projectId);
  const params = useFileManagerStore((state) => state.files[fileId].params, projectId);
  const helpIconRef = useRef<HTMLButtonElement>(null);

  const {
    safeProperties,
    handleValueChange,
    handleTypeChange,
    handleRemoveProperty,
    handleRenameProperty,
    handleAddProperty,
    handleOptionalityChange,
    normalizeTypeKind,
  } = useProperties({
    projectId,
    fileId,
    properties,
    params,
  });

  const handleHelpClick = () => {
    if (helpIconRef.current) {
      openPinnedModal("property-panel.help", helpIconRef, "left");
    } else {
      console.warn("helpIconRef.current is null");
    }
  };

  return (
    <div className="grid h-full min-h-0 grid-rows-[1fr_auto]">
      <div className="min-h-0 overflow-y-auto">
        {safeProperties.length > 0 ? (
          safeProperties.map(([name, { type, optional }]) => {
            const param = params?.[name];
            const normalizedTypeKind = normalizeTypeKind(type.kind);
            return (
              <Property
                key={name}
                name={name}
                type={type}
                param={param}
                normalizedTypeKind={normalizedTypeKind}
                optional={optional ?? false}
                projectId={projectId}
                fileId={fileId}
                onValueChange={handleValueChange}
                onTypeChange={handleTypeChange}
                onOptionalityChange={handleOptionalityChange}
                onRemove={handleRemoveProperty}
                onRename={handleRenameProperty}
              />
            );
          })
        ) : (
          <IdlePlaceholder icon={CardholderIcon} label="There is no property yet" />
        )}
      </div>
      <AsideFooter icon={QuestionIcon} onIconClick={handleHelpClick} iconRef={helpIconRef}>
        <ActionButton icon={PlusIcon} onClick={handleAddProperty}>
          Property
        </ActionButton>
      </AsideFooter>
    </div>
  );
}

export default PropertyPanel;
