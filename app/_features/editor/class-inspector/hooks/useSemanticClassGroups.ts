import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import { useEffect, useState } from "react";
import { getSemanticClassGroups } from "../services/getSemanticClassGroups";
import type { SemanticClassGroup } from "../types";

export function useSemanticClassGroups(classes: StringLiteralClasses | TemplateLiteralClasses | null): {
  semanticClassGroups: SemanticClassGroup[];
  hasStaticClasses: boolean;
} {
  const [semanticClassGroups, setSemanticClassGroups] = useState<SemanticClassGroup[]>([]);

  useEffect(() => {
    if (classes?.classTokens) {
      const groups = getSemanticClassGroups(classes.classTokens);
      setSemanticClassGroups(groups);
    } else {
      setSemanticClassGroups([]);
    }
  }, [classes]);

  return {
    semanticClassGroups,
    hasStaticClasses: semanticClassGroups.length > 0,
  };
}
