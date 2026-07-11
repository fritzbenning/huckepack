import { useEnumMode } from "@editor/design/modes/enum-mode";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { NumericEnumExtentionInput, NumericValueInput, useNumericConfig } from "@editor/design/values/numeric";
import { SlidersHorizontalIcon } from "@phosphor-icons/react";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { Activity } from "react";
import { config } from "./config";

function LetterSpacing(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const { prefix } = useNumericConfig({ config, featurePrefix: "letterSpacing" });

  const { isEnumMode, toggle } = useEnumMode({
    config,
    featurePrefix: "letterSpacing",
    classPrefix: prefix,
    classTokens,
    astPosition,
    projectId,
    fileId,
  });

  return (
    <DesignRuleInputRow>
      <Activity mode={isEnumMode ? "visible" : "hidden"}>
        <NumericEnumExtentionInput
          featurePrefix="letterSpacing"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </Activity>
      <Activity mode={isEnumMode ? "hidden" : "visible"}>
        <NumericValueInput
          featurePrefix="letterSpacing"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
          allowNegative={true}
        />
      </Activity>
      <IconToggle icon={SlidersHorizontalIcon} isActive={!isEnumMode} onChange={toggle} />
    </DesignRuleInputRow>
  );
}

export default LetterSpacing;
