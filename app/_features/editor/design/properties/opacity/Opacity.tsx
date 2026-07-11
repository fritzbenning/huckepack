import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { usePercentValue } from "@editor/design/values/percent";
import { BowlingBallIcon } from "@phosphor-icons/react";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { Input } from "@shared/ui-kit/inputs/input/Input";
import { config } from "./config";

function Opacity(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const opacityValue = usePercentValue({
    config,
    featurePrefix: "opacity",
    classTokens,
    projectId,
    fileId,
    astPosition,
  });

  return (
    <DesignRuleInputRow>
      <Input
        icon={BowlingBallIcon}
        value={opacityValue.value}
        onChange={opacityValue.onValueChange}
        placeholder="100"
        staticUnit="%"
        tone="emphasized"
        inputClassName="h-7"
        className="flex-1"
        type="number"
        min={0}
        max={100}
      />
    </DesignRuleInputRow>
  );
}

export default Opacity;
