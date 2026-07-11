import { useEnumMode } from "@editor/design/modes/enum-mode";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { NumericEnumExtentionInput, NumericTokenExtentionInput, useNumericConfig } from "@editor/design/values/numeric";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { IconArrowAutofitContent } from "@tabler/icons-react";
import { Activity } from "react";
import { config } from "./config";

function MinWidth(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const { prefix, defaultUnit } = useNumericConfig({ config, featurePrefix: "minWidth" });

  const { isEnumMode, toggle: toggleEnumMode } = useEnumMode({
    config,
    featurePrefix: "minWidth",
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
          featurePrefix="minWidth"
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
          featurePrefix="minWidth"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </Activity>
      <IconToggle icon={IconArrowAutofitContent} isActive={isEnumMode ?? false} onChange={toggleEnumMode} />
    </DesignRuleInputRow>
  );
}

export default MinWidth;
