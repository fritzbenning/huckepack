import { useFeatureDisplay } from "@editor/design/shared";
import { type DesignPropertyComponentProps, useClassTokens } from "@editor/design/ui/design-rule";
import { EnumValueInput } from "@editor/design/values/enum";
import { StringValueInput } from "@editor/design/values/string";
import DesignRuleInputRow from "@shared/ui-kit/editor/ui/DesignRuleInputRow";
import { config } from "./config";

function BackgroundImage(props: DesignPropertyComponentProps) {
  const { projectId, fileId, classes, astPosition } = props;

  const classTokens = useClassTokens({ classes });

  const displayOrigin = useFeatureDisplay({
    config,
    featurePrefix: "backgroundOrigin",
    classTokens,
  });

  const displayClip = useFeatureDisplay({
    config,
    featurePrefix: "backgroundClip",
    classTokens,
  });

  return (
    <div className="flex flex-col gap-1.5">
      <DesignRuleInputRow>
        <StringValueInput
          featurePrefix="backgroundImage"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
          placeholder="Image URL"
        />
      </DesignRuleInputRow>
      <DesignRuleInputRow>
        <EnumValueInput
          featurePrefix="backgroundSize"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </DesignRuleInputRow>
      <DesignRuleInputRow>
        <EnumValueInput
          featurePrefix="backgroundRepeat"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </DesignRuleInputRow>
      <DesignRuleInputRow>
        <EnumValueInput
          featurePrefix="backgroundPosition"
          config={config}
          classTokens={classTokens}
          astPosition={astPosition}
          projectId={projectId}
          fileId={fileId}
          className="flex-1"
        />
      </DesignRuleInputRow>
      {displayOrigin && (
        <DesignRuleInputRow>
          <EnumValueInput
            featurePrefix="backgroundOrigin"
            config={config}
            classTokens={classTokens}
            astPosition={astPosition}
            projectId={projectId}
            fileId={fileId}
            className="flex-1"
          />
        </DesignRuleInputRow>
      )}
      {displayClip && (
        <DesignRuleInputRow>
          <EnumValueInput
            featurePrefix="backgroundClip"
            config={config}
            classTokens={classTokens}
            astPosition={astPosition}
            projectId={projectId}
            fileId={fileId}
            className="flex-1"
          />
        </DesignRuleInputRow>
      )}
    </div>
  );
}

export default BackgroundImage;
