import { useEnumMode } from "@editor/design/modes/enum-mode";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { NumericEnumExtentionInput, NumericTokenExtentionInput, useNumericConfig } from "@editor/design/values/numeric";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { IconArrowAutofitContent } from "@tabler/icons-react";
import { Activity } from "react";
import { config } from "./config";

function Height(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });
  const { prefix, defaultUnit } = useNumericConfig({ config, featurePrefix: "height" });

  const { isEnumMode, toggle: toggleEnumMode } = useEnumMode({
    config,
    featurePrefix: "height",
    classTokens,
    classPrefix: prefix,
    astPosition,
    projectId,
    fileId,
    numericTargetValue: {
      value: 100,
      unit: defaultUnit ?? "scale",
    },
  });

  return (
    <DesignRuleInputRow>
      <Activity mode={isEnumMode ? "visible" : "hidden"}>
        <NumericEnumExtentionInput
          featurePrefix="height"
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
          featurePrefix="height"
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

export default Height;
