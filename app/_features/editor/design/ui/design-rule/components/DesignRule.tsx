import type { Id } from "@convex/_generated/dataModel";
import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import type { DesignPropertyConfig, DesignPropertyRegistryEntry } from "@editor/design/registry";
import { useDesignPropertyRemover } from "@editor/design/shared";
import { DesignRuleWrapper } from "./DesignRuleWrapper";

interface DesignRuleProps {
  rule: DesignPropertyRegistryEntry;
  config: DesignPropertyConfig;
  projectId: Id<"projects">;
  fileId: Id<"files">;
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  astPosition: number | null;
}

export function DesignRule({ rule, config, projectId, fileId, classes, astPosition }: DesignRuleProps) {
  const { removeAll } = useDesignPropertyRemover({
    config,
    classes,
    projectId,
    fileId,
    astPosition,
  });

  const RuleComponent = rule.component;

  return (
    <DesignRuleWrapper title={rule.key === "flexLayout" ? undefined : rule.displayName} onDelete={removeAll}>
      <RuleComponent projectId={projectId} fileId={fileId} classes={classes} astPosition={astPosition} />
    </DesignRuleWrapper>
  );
}
