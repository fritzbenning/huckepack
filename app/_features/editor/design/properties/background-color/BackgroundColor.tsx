import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { ColorValueInput } from "@editor/design/values/color";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { config } from "./config";

function BackgroundColor(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  return (
    <DesignRuleInputRow>
      <ColorValueInput
        featurePrefix="backgroundColor"
        config={config}
        classTokens={classTokens}
        astPosition={astPosition}
        projectId={projectId}
        fileId={fileId}
        showOpacity={false}
        placeholder="#000000"
        dimension="small"
        tone="emphasized"
        className="flex-1"
      />
    </DesignRuleInputRow>
  );
}

export default BackgroundColor;
