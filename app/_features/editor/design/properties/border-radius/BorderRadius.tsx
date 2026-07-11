import { useIndividualMode } from "@editor/design/modes/individual-mode";
import { hasIndividualCorners } from "@editor/design/shared/utils";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { NumericTokenExtentionInput } from "@editor/design/values/numeric";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { IconBorderCorners } from "@tabler/icons-react";
import { Activity } from "react";
import { config } from "./config";

function BorderRadius(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const { isIndividualMode, toggle: toggleIndividualMode } = useIndividualMode({
    config,
    classTokens,
    astPosition,
    projectId,
    fileId,
    detect: (tokens) => hasIndividualCorners(tokens, "rounded"),
  });

  return (
    <DesignRuleInputRow>
      <Activity mode={isIndividualMode ? "visible" : "hidden"}>
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          {config.individualMode.individual.map((key) => {
            return (
              <NumericTokenExtentionInput
                key={key}
                featurePrefix={key}
                config={config}
                classTokens={classTokens}
                astPosition={astPosition}
                projectId={projectId}
                fileId={fileId}
                hideUnitLabel={true}
              />
            );
          })}
        </div>
      </Activity>
      <Activity mode={!isIndividualMode ? "visible" : "hidden"}>
        <NumericTokenExtentionInput
          featurePrefix={config.individualMode.unified}
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </Activity>
      <IconToggle icon={IconBorderCorners} isActive={isIndividualMode ?? false} onChange={toggleIndividualMode} />
    </DesignRuleInputRow>
  );
}

export default BorderRadius;
