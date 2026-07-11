import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { NumericTokenExtentionInput } from "@editor/design/values/numeric";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { config } from "./config";

function FontSize(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  return (
    <DesignRuleInputRow>
      <NumericTokenExtentionInput
        featurePrefix="fontSize"
        config={config}
        classTokens={classTokens}
        astPosition={astPosition}
        projectId={projectId}
        fileId={fileId}
        className="flex-1"
      />
    </DesignRuleInputRow>
  );
}

export default FontSize;
