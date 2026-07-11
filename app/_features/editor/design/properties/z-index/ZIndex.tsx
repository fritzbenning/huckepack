import { useEnumMode } from "@editor/design/modes/enum-mode";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { NumericValueInput, useNumericConfig } from "@editor/design/values/numeric";
import { StackIcon } from "@phosphor-icons/react";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { TextToggle } from "@shared/ui-kit/editor/ui/TextToggle";
import { config } from "./config";

function ZIndex(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const { prefix } = useNumericConfig({ config, featurePrefix: "zIndex" });

  const { isEnumMode, toggle: toggleEnumMode } = useEnumMode({
    config,
    featurePrefix: "zIndex",
    classPrefix: prefix,
    classTokens,
    astPosition,
    projectId,
    fileId,
  });

  return (
    <DesignRuleInputRow>
      <NumericValueInput
        featurePrefix="zIndex"
        config={config}
        classTokens={classTokens}
        astPosition={astPosition}
        projectId={projectId}
        fileId={fileId}
        className="flex-1"
        icon={StackIcon}
      />
      <TextToggle text="auto" isActive={isEnumMode} onChange={toggleEnumMode} />
    </DesignRuleInputRow>
  );
}

export default ZIndex;
