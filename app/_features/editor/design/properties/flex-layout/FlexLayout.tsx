import { type DesignPropertyComponentProps, useDesignProperty } from "@editor/design/ui/design-rule";
import { NumericValueInput } from "@editor/design/values/numeric";
import { ArrowDownIcon, ArrowRightIcon, ArrowsHorizontalIcon, ArrowUDownLeftIcon } from "@phosphor-icons/react";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { type IconTabItem, IconTabs } from "@shared/ui-kit/editor/ui/IconTabs";
import { IconToggle } from "@shared/ui-kit/editor/ui/IconToggle";
import { IconSpacingHorizontal, IconSpacingVertical } from "@tabler/icons-react";
import { config } from "./config";
import FlexManager from "./FlexManager";

// TODO: Refactor it safely. It's legacy.

function FlexLayout(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const { classTokens, getClassValue, update, toggle, hasClass } = useDesignProperty({
    config,
    classes,
    projectId,
    fileId,
    astPosition,
  });

  const flexDirection = getClassValue("flexDirection") as "flex-row" | "flex-col";
  const gapIcon = flexDirection === "flex-col" ? IconSpacingVertical : IconSpacingHorizontal;

  const tabFlexDirectionItems: IconTabItem<"flex-row" | "flex-col">[] = [
    {
      value: "flex-row",
      icon: ArrowRightIcon,
      label: "Row",
    },
    {
      value: "flex-col",
      icon: ArrowDownIcon,
      label: "Column",
    },
  ];

  return (
    <div className="flex flex-row gap-2">
      <FlexManager {...props} />
      <div className="relative z-20 flex flex-col gap-1.5">
        <DesignRuleInputRow>
          <IconTabs
            items={tabFlexDirectionItems}
            activeValue={flexDirection}
            onChange={(direction) => update("flexDirection", direction)}
            className="flex-1"
          />
          <IconToggle icon={ArrowUDownLeftIcon} isActive={hasClass("flex-wrap")} onChange={() => toggle("flexWrap")} />
        </DesignRuleInputRow>
        <DesignRuleInputRow>
          <NumericValueInput
            featurePrefix="gap"
            config={config}
            classTokens={classTokens}
            astPosition={astPosition}
            projectId={projectId}
            fileId={fileId}
            icon={gapIcon}
            tone="emphasized"
            inputClassName="h-7"
          />
          <IconToggle
            icon={ArrowsHorizontalIcon}
            isActive={hasClass("justify-between")}
            onChange={() => toggle("justifyBetween")}
          />
        </DesignRuleInputRow>
      </div>
    </div>
  );
}

export default FlexLayout;
