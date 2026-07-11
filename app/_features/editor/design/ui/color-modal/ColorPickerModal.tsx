import type { Id } from "@convex/_generated/dataModel";
import { useNodeClasses } from "@editor/class-inspector/hooks/useNodeClasses";
import { useClassTokens } from "@editor/design/ui/design-rule";
import { useColorValue } from "@editor/design/values/color";
import type { BasePinnedModalProps } from "@shared/pinned-modal/types";
import { ColorPicker } from "@shared/ui-kit/editor/ui/ColorPicker";
import { ModalContainer } from "@shared/ui-kit/ui/ModalContainer";
import { ModalContent } from "@shared/ui-kit/ui/ModalContent";
import { ModalHeader } from "@shared/ui-kit/ui/ModalHeader";
import { useCallback } from "react";
import { config } from "../../properties/background-color/config";

interface ColorPickerModalProps extends BasePinnedModalProps {
  projectId: Id<"projects">;
  fileId: Id<"files">;
  showOpacity?: boolean;
}

export function ColorPickerModal({ isOpen, onClose, projectId, fileId, showOpacity = false }: ColorPickerModalProps) {
  const { classes, astPosition } = useNodeClasses(projectId, fileId);

  const classTokens = useClassTokens({ classes });

  const colorValue = useColorValue({
    config,
    featurePrefix: "backgroundColor",
    classTokens,
    projectId,
    fileId,
    astPosition,
  });

  const handleTailwindColorChange = useCallback(
    async (color: string, shade: number) => {
      await colorValue.onTailwindColorChange(color, shade);
      onClose();
    },
    [colorValue.onTailwindColorChange, onClose]
  );

  if (!isOpen) return null;

  return (
    <ModalContainer className="w-80" size="custom">
      <ModalHeader title="Background Color" onClose={onClose} />
      <ModalContent>
        <ColorPicker
          value={colorValue.hexValue}
          onChange={colorValue.onColorChange}
          showOpacity={showOpacity}
          isArbitraryMode={colorValue.isArbitraryMode}
          onModeToggle={colorValue.toggleArbitraryMode}
          onTailwindColorChange={handleTailwindColorChange}
        />
      </ModalContent>
    </ModalContainer>
  );
}
