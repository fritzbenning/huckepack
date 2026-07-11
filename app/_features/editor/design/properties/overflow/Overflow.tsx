import { toggleIndividualMode } from "@editor/design/modes/individual-mode";
import { hasExpandedClasses, normalizePrefix } from "@editor/design/shared/utils";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { EnumValueInput } from "@editor/design/values/enum";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { IconAxisX } from "@tabler/icons-react";
import { Activity, useCallback } from "react";
import { useDetectedRuleState } from "../../ui/design-panel/hooks/useDetectedRuleState";
import { config } from "./config";

function Overflow(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const { isActive: individualMode } = useDetectedRuleState({
    classTokens,
    detect: (tokens) => hasExpandedClasses(tokens, ["overflow-x-", "overflow-y-"]),
  });

  const handleToggleMode = useCallback(async () => {
    const newIndividualMode = !individualMode;

    await toggleIndividualMode({
      toIndividualMode: newIndividualMode,
      unifiedFeatureKey: "overflow",
      individualFeatureKeys: ["overflowX", "overflowY"],
      config,
      classTokens,
      astPosition,
      projectId,
      fileId,
      extractSuffixFn: (className: string, prefix: string) => {
        const normalizedPrefix = normalizePrefix(prefix);
        if (className.startsWith(normalizedPrefix)) {
          return className.substring(normalizedPrefix.length);
        }
        return null;
      },
      applySuffixFn: (prefix: string, suffix: string | null) => {
        if (!suffix) return "";
        const normalizedPrefix = normalizePrefix(prefix);
        return `${normalizedPrefix}${suffix}`;
      },
    });
  }, [individualMode, classTokens, astPosition, projectId, fileId]);

  return (
    <DesignRuleInputRow>
      <Activity mode={individualMode ? "visible" : "hidden"}>
        <div className="flex flex-1 flex-col gap-1.5">
          <EnumValueInput
            featurePrefix="overflowX"
            config={config}
            classTokens={classTokens}
            astPosition={astPosition}
            projectId={projectId}
            fileId={fileId}
            className="flex-1"
          />
          <EnumValueInput
            featurePrefix="overflowY"
            config={config}
            classTokens={classTokens}
            astPosition={astPosition}
            projectId={projectId}
            fileId={fileId}
            className="flex-1"
          />
        </div>
      </Activity>
      <Activity mode={individualMode ? "hidden" : "visible"}>
        <EnumValueInput
          featurePrefix="overflow"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </Activity>
      <IconToggle icon={IconAxisX} isActive={individualMode ?? false} onChange={handleToggleMode} />
    </DesignRuleInputRow>
  );
}

export default Overflow;
