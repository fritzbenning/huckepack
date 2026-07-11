import type { Id } from "@convex/_generated/dataModel";
import type { DesignPropertyConfig } from "@editor/design/registry";
import { ColorInput } from "@shared/ui-kit/editor/ui/ColorInput";
import { useColorValue } from "../hooks/useColorValue";

interface ColorValueInputProps {
  featurePrefix: string;
  config: DesignPropertyConfig;
  classTokens: string[] | null;
  astPosition: number | null;
  projectId: string;
  fileId: string;
  className?: string;
  placeholder?: string;
  showOpacity?: boolean;
  modalName?: "design-panel.color-picker" | "design-panel.text-color-picker";
  dimension?: "tiny" | "small" | "medium" | "large";
  tone?: "subtle" | "emphasized";
}

export function ColorValueInput({
  featurePrefix,
  config,
  classTokens,
  astPosition,
  projectId,
  fileId,
  className,
  placeholder = "#000000",
  showOpacity = false,
  modalName = "design-panel.color-picker",
  dimension = "small",
  tone = "emphasized",
}: ColorValueInputProps) {
  const colorValue = useColorValue({
    config,
    featurePrefix,
    classTokens,
    astPosition,
    projectId,
    fileId,
  });

  return (
    <ColorInput
      value={colorValue.hexValue}
      onChange={colorValue.onColorChange}
      projectId={projectId as Id<"projects">}
      fileId={fileId as Id<"files">}
      showOpacity={showOpacity}
      placeholder={placeholder}
      dimension={dimension}
      tone={tone}
      className={className}
      modalName={modalName}
    />
  );
}
