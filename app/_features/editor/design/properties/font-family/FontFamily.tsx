import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { EnumValueInput } from "@editor/design/values/enum";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { IconTypography } from "@tabler/icons-react";
import { Activity, useCallback, useEffect, useState } from "react";
import { useDetectedRuleState } from "../../ui/design-panel/hooks/useDetectedRuleState";
import { config } from "./config";

function FontFamily(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const { isActive: isGoogleFontsMode } = useDetectedRuleState({
    classTokens,
    detect: (tokens) => tokens?.some((token) => token.startsWith("font-[") && token.includes("_")) ?? false,
  });

  const [googleMode, setGoogleMode] = useState(isGoogleFontsMode ?? false);

  useEffect(() => {
    if (isGoogleFontsMode !== undefined) {
      setGoogleMode(isGoogleFontsMode);
    }
  }, [isGoogleFontsMode]);

  const handleToggleMode = useCallback(() => {
    setGoogleMode((prev) => !prev);
  }, []);

  return (
    <DesignRuleInputRow>
      <Activity mode={googleMode ? "hidden" : "visible"}>
        <EnumValueInput
          featurePrefix="standard"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </Activity>
      <Activity mode={googleMode ? "visible" : "hidden"}>
        <EnumValueInput
          featurePrefix="google"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </Activity>
      <IconToggle icon={IconTypography} isActive={googleMode} onChange={handleToggleMode} />
    </DesignRuleInputRow>
  );
}

export default FontFamily;
