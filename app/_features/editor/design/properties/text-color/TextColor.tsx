import type { Id } from "@convex/_generated/dataModel";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { useColorValue } from "@editor/design/values/color";
import { ColorInput } from "@shared/ui-kit/editor/ui/ColorInput";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { config } from "./config";

// TODO: Color modal is shared with background color; verify it doesn't update the wrong property.

function TextColor(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const colorValue = useColorValue({
    config,
    featurePrefix: "textColor",
    classTokens,
    projectId,
    fileId,
    astPosition,
  });

  return (
    <DesignRuleInputRow>
      <ColorInput
        value={colorValue.hexValue}
        onChange={colorValue.onColorChange}
        projectId={projectId as Id<"projects">}
        fileId={fileId as Id<"files">}
        showOpacity={false}
        placeholder="#000000"
        dimension="small"
        tone="emphasized"
        className="flex-1"
        modalName="design-panel.text-color-picker"
      />
    </DesignRuleInputRow>
  );
}

export default TextColor;
