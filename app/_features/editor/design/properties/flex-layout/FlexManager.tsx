import { useFeatureClasses } from "@editor/design/shared/hooks/feature/useFeatureClasses";
import { type DesignPropertyComponentProps, useDesignProperty } from "@editor/design/ui/design-rule";
import { useEnumConfig } from "@editor/design/values/enum";
import { useMemo } from "react";
import { config } from "./config";
import { FlexManagerItem } from "./FlexManagerItem";
import type { AlignItem, JustifyContent } from "./types";

type FlexManagerProps = DesignPropertyComponentProps;

// TODO: Refactor it safely. It's legacy.

const FlexManager = (props: FlexManagerProps) => {
  const { projectId, fileId, classes, astPosition } = props;

  const { classTokens, getClassValue, update } = useDesignProperty({
    config,
    classes,
    projectId,
    fileId,
    astPosition,
  });

  const flexDirection = getClassValue("flexDirection") as "flex-row" | "flex-col";
  const isFlexCol = flexDirection === "flex-col";
  const isJustifyBetween = classTokens?.includes("justify-between") ?? false;

  const alignItemsConfig = useEnumConfig({ config, featurePrefix: "alignItems" });
  const justifyContentConfig = useEnumConfig({ config, featurePrefix: "justifyContent" });

  const alignItemsClasses = alignItemsConfig.classes as readonly AlignItem[];
  const justifyContentClasses = justifyContentConfig.classes as readonly JustifyContent[];

  const { alignItems, justifyContent } = useFeatureClasses({
    config,
    classTokens,
    features: [{ prefix: "alignItems" }, { prefix: "justifyContent" }],
  });

  const currentAlign = (alignItems || null) as AlignItem | null;
  const currentJustify = isJustifyBetween ? null : ((justifyContent || null) as JustifyContent | null);

  const handleAlignment = async (align: AlignItem, justify: JustifyContent) => {
    if (isJustifyBetween && (justify === "justify-center" || justify === "justify-end")) {
      await update("justifyBetween", "justify-start");
    }

    await update("alignItems", align);
    await update("justifyContent", justify);
  };

  const gridItems = useMemo(() => {
    const items: Array<{ align: AlignItem; justify: JustifyContent }> = [];

    if (isFlexCol) {
      for (const justify of justifyContentClasses) {
        for (const align of alignItemsClasses) {
          items.push({ align, justify });
        }
      }
    } else {
      for (const align of alignItemsClasses) {
        for (const justify of justifyContentClasses) {
          items.push({ align, justify });
        }
      }
    }

    return items;
  }, [isFlexCol, alignItemsClasses, justifyContentClasses]);

  return (
    <div className="inspector-tool grid shrink-0 grid-cols-3 place-items-center gap-x-1 p-1">
      {gridItems.map((item, index) => (
        <FlexManagerItem
          key={`${item.align}-${item.justify}-${index}`}
          onClick={() => handleAlignment(item.align, item.justify)}
          isActive={currentAlign === item.align && (currentJustify === null || currentJustify === item.justify)}
        />
      ))}
    </div>
  );
};

export default FlexManager;
