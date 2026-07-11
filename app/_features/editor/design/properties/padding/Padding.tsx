import { useIndividualMode } from "@editor/design/modes/individual-mode";
import { getExpandedPrefixes, getIndividualFeatureMap, hasExpandedClasses } from "@editor/design/shared/utils";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { NumericValueInput } from "@editor/design/values/numeric";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { IconBoxModel } from "@tabler/icons-react";
import { Activity, useMemo } from "react";
import { config } from "./config";

function Padding(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const { isIndividualMode, toggle: toggleIndividualMode } = useIndividualMode({
    config,
    classTokens,
    astPosition,
    projectId,
    fileId,
    detect: (tokens) => {
      const { normalized, original } = getExpandedPrefixes(config);
      return hasExpandedClasses(tokens, normalized) || (tokens?.some((token) => original.includes(token)) ?? false);
    },
  });

  const individualFeatureMap = useMemo(() => getIndividualFeatureMap(config), []);

  return (
    <DesignRuleInputRow>
      <Activity mode={isIndividualMode ? "visible" : "hidden"}>
        <div className="grid flex-1 grid-cols-2 gap-1.5">
          {individualFeatureMap.map((input) => {
            if (!input) return null;
            const { key, icon } = input;
            return (
              <NumericValueInput
                key={key}
                featurePrefix={key}
                config={config}
                classTokens={classTokens}
                astPosition={astPosition}
                projectId={projectId}
                fileId={fileId}
                hideUnitLabel={true}
                icon={icon}
              />
            );
          })}
        </div>
      </Activity>
      <Activity mode={!isIndividualMode ? "visible" : "hidden"}>
        <NumericValueInput
          featurePrefix={config.individualMode.unified}
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </Activity>
      <IconToggle icon={IconBoxModel} isActive={isIndividualMode} onChange={toggleIndividualMode} />
    </DesignRuleInputRow>
  );
}

export default Padding;
