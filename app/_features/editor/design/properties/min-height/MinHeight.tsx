import { useEnumMode } from "@editor/design/modes/enum-mode";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { NumericEnumExtentionInput, NumericTokenExtentionInput, useNumericConfig } from "@editor/design/values/numeric";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { IconArrowAutofitHeight } from "@tabler/icons-react";
import { Activity } from "react";
import { config } from "./config";

function MinHeight(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const { prefix, defaultUnit } = useNumericConfig({ config, featurePrefix: "minHeight" });

  const { isEnumMode, toggle: toggleEnumMode } = useEnumMode({
    config,
    featurePrefix: "minHeight",
    classPrefix: prefix,
    classTokens,
    astPosition,
    projectId,
    fileId,
    numericTargetValue: {
      value: defaultUnit === "scale" ? 100 : 0,
      unit: defaultUnit === "scale" ? "scale" : defaultUnit === "rem" ? "rem" : "px",
    },
  });

  return (
    <DesignRuleInputRow>
      <Activity mode={isEnumMode ? "visible" : "hidden"}>
        <NumericEnumExtentionInput
          featurePrefix="minHeight"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </Activity>
      <Activity mode={isEnumMode ? "hidden" : "visible"}>
        <NumericTokenExtentionInput
          featurePrefix="minHeight"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </Activity>
      <IconToggle icon={IconArrowAutofitHeight} isActive={isEnumMode ?? false} onChange={toggleEnumMode} />
    </DesignRuleInputRow>
  );
}

export default MinHeight;
