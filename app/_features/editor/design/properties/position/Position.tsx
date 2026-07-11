import { useIndividualMode } from "@editor/design/modes/individual-mode";
import { getExpandedPrefixes, getIndividualFeatureMap, hasExpandedClasses } from "@editor/design/shared/utils";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { EnumValueInput } from "@editor/design/values/enum";
import { NumericValueInput } from "@editor/design/values/numeric";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { IconBorderSides } from "@tabler/icons-react";
import { Activity, useMemo } from "react";
import { config } from "./config";

function Position(props: DesignPropertyComponentProps) {
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
    <div className="flex flex-col gap-1.5">
      <DesignRuleInputRow>
        <EnumValueInput
          featurePrefix="position"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
        <IconToggle icon={IconBorderSides} isActive={isIndividualMode} onChange={toggleIndividualMode} />
      </DesignRuleInputRow>
      <DesignRuleInputRow>
        <Activity mode={isIndividualMode ? "visible" : "hidden"}>
          <div className="grid flex-1 grid-cols-2 gap-1.5">
            {individualFeatureMap.map((feature) => {
              if (!feature) return null;
              const { key, icon } = feature;
              return (
                <NumericValueInput
                  key={key}
                  featurePrefix={key}
                  config={config}
                  classTokens={classTokens}
                  astPosition={astPosition}
                  projectId={projectId}
                  fileId={fileId}
                  icon={icon}
                  hideUnitLabel={true}
                />
              );
            })}
          </div>
        </Activity>
        <Activity mode={!isIndividualMode ? "visible" : "hidden"}>
          <NumericValueInput
            featurePrefix="inset"
            config={config}
            classTokens={classTokens}
            astPosition={astPosition}
            projectId={projectId}
            fileId={fileId}
            className="flex-1"
          />
        </Activity>
      </DesignRuleInputRow>
    </div>
  );
}

export default Position;
