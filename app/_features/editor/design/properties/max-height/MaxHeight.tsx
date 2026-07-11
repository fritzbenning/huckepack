import { useEnumMode } from "@editor/design/modes/enum-mode";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { NumericEnumExtentionInput, NumericTokenExtentionInput, useNumericConfig } from "@editor/design/values/numeric";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { IconArrowAutofitHeight } from "@tabler/icons-react";
import { Activity } from "react";
import { config } from "./config";

function MaxHeight(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const { prefix, defaultUnit } = useNumericConfig({ config, featurePrefix: "maxHeight" });

  const { isEnumMode, toggle: toggleEnumMode } = useEnumMode({
    config,
    featurePrefix: "maxHeight",
    classPrefix: prefix,
    classTokens,
    astPosition,
    projectId,
    fileId,
    numericTargetValue: {
      value: 100,
      unit: defaultUnit ?? "px",
    },
  });

  return (
    <DesignRuleInputRow>
      <Activity mode={isEnumMode ? "visible" : "hidden"}>
        <NumericEnumExtentionInput
          featurePrefix="maxHeight"
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
          featurePrefix="maxHeight"
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

export default MaxHeight;
