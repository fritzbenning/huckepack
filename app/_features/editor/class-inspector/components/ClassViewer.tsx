import type { Id } from "@convex/_generated/dataModel";
import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import { getFileClassSuggestions, setFileClassSuggestions } from "@project/file-manager/stores/fileManagerStore";
import { executeAction } from "@shared/action";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import { useMemo } from "react";
import { CATEGORY_PATTERNS } from "../constants";
import { useClassSuggestions } from "../hooks/useClassSuggestions";
import { useConditionalSegments } from "../hooks/useConditionalSegments";
import { useSemanticClassGroups } from "../hooks/useSemanticClassGroups";
import type { SemanticClassGroup } from "../types";
import { ClassSuggestion as ClassSuggestionComponent } from "./ClassSuggestion";
import { ConditionalClassesSection } from "./ConditionalClassesSection";
import { StaticClassGroup } from "./StaticClassGroup";

export function ClassViewer({
  projectId,
  fileId,
  classes,
  selectedNodeAstPosition,
  nodeId,
}: {
  projectId: string;
  fileId: string;
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
  selectedNodeAstPosition: number | null;
  nodeId: string | null;
}) {
  const { semanticClassGroups } = useSemanticClassGroups(classes);
  const conditionalSegments = useConditionalSegments(classes);
  const suggestions = useClassSuggestions(projectId, fileId, selectedNodeAstPosition, nodeId, classes);

  // Filter out suggestions that are already present in existing tokens
  const allTokens = useMemo(() => {
    return semanticClassGroups.flatMap((group) => group.tokens);
  }, [semanticClassGroups]);

  const filteredSuggestions = useMemo(() => {
    if (suggestions.length === 0) {
      return [];
    }
    const tokenSet = new Set(allTokens);
    return suggestions.filter((suggestion) => !tokenSet.has(suggestion));
  }, [suggestions, allTokens]);

  // Sort groups by category order
  const allGroups = useMemo(() => {
    const categoryOrderMap = new Map(CATEGORY_PATTERNS.map(({ category, sortOrder }) => [category, sortOrder]));
    return [...semanticClassGroups].sort((a, b) => {
      const orderA = categoryOrderMap.get(a.category) ?? Number.MAX_VALUE;
      const orderB = categoryOrderMap.get(b.category) ?? Number.MAX_VALUE;
      return orderA - orderB;
    });
  }, [semanticClassGroups]);

  const handleSuggestionClick = async (suggestion: string) => {
    if (!selectedNodeAstPosition) {
      console.error("No node position available");
      return;
    }

    try {
      await executeAction("node.class.add", {
        className: suggestion,
        nodeStart: selectedNodeAstPosition,
        projectId,
        fileId,
      });
    } catch (err) {
      console.error("[ClassViewer] Error handling suggestion:", err);
    }
  };

  const handleSuggestionRemove = (suggestionToRemove: string) => {
    console.log("[ClassViewer] handleSuggestionRemove called", { suggestionToRemove, nodeId, fileId, projectId });

    if (!nodeId) {
      console.warn("[ClassViewer] No nodeId available, cannot remove suggestion");
      return;
    }

    // Remove from the actual suggestions state (which includes all suggestions, not just filtered ones)
    console.log("[ClassViewer] Current suggestions state before removal:", suggestions);

    const filtered = suggestions.filter((s) => s !== suggestionToRemove);

    console.log("[ClassViewer] Filtered suggestions after removal:", filtered);

    // Update store - this should trigger the hook's sync effect
    setFileClassSuggestions(fileId as Id<"files">, nodeId, filtered, projectId as Id<"projects">);
    console.log("[ClassViewer] Suggestions updated in store");

    // Verify the update
    const verify = getFileClassSuggestions(fileId as Id<"files">, nodeId, projectId as Id<"projects">);
    console.log("[ClassViewer] Verified store after update:", verify);
  };

  return (
    <>
      {allGroups.map((group: SemanticClassGroup) => (
        <StaticClassGroup
          key={group.category}
          {...group}
          projectId={projectId}
          fileId={fileId}
          selectedNodeAstPosition={selectedNodeAstPosition}
        />
      ))}
      {filteredSuggestions.length > 0 && (
        <AsideSection contentGap="small">
          {filteredSuggestions.map((suggestion) => (
            <ClassSuggestionComponent
              key={suggestion}
              suggestion={suggestion}
              onClick={handleSuggestionClick}
              onRemove={handleSuggestionRemove}
            />
          ))}
        </AsideSection>
      )}
      {conditionalSegments.length > 0 && (
        <ConditionalClassesSection
          conditionalSegments={conditionalSegments}
          projectId={projectId}
          fileId={fileId}
          selectedNodeAstPosition={selectedNodeAstPosition}
        />
      )}
    </>
  );
}
