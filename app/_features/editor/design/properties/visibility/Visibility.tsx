import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { EnumValueInput } from "@editor/design/values/enum";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { config } from "./config";

function Visibility(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  return (
    <DesignRuleInputRow>
      <EnumValueInput
        featurePrefix="visibility"
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

export default Visibility;
