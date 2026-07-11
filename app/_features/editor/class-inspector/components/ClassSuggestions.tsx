import type { Id } from "@convex/_generated/dataModel";
import { useAuthToken } from "@convex-dev/auth/react";
import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import { useFileReferenceCode } from "@project/file-manager";
import { executeAction } from "@shared/action";
import { AsideSection } from "@shared/ui-kit/layout/AsideSection";
import { useEffect, useRef, useState } from "react";
import { ClassSuggestion as ClassSuggestionComponent } from "./ClassSuggestion";

interface ClassSuggestionsProps {
  projectId: string;
  fileId: string;
  selectedNodeAstPosition: number | null;
  nodeId: string | null;
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
}

export function ClassSuggestions({
  projectId,
  fileId,
  selectedNodeAstPosition,
  nodeId,
  classes,
}: ClassSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const componentCode = useFileReferenceCode(projectId as Id<"projects">, fileId as Id<"files">);
  const token = useAuthToken();
  const prevClassTokensRef = useRef<string[]>([]);

  const classTokens = classes?.classTokens ?? [];

  useEffect(() => {
    if (!nodeId || !selectedNodeAstPosition || !componentCode) {
      setSuggestions([]);
      return;
    }

    const classTokensStr = classTokens.join(" ");
    const prevClassTokensStr = prevClassTokensRef.current.join(" ");

    if (classTokensStr === prevClassTokensStr) {
      return;
    }

    prevClassTokensRef.current = [...classTokens];

    const fetchSuggestions = async () => {
      setError(null);

      try {
        const convexUrl = import.meta.env.VITE_CONVEX_URL;
        if (!convexUrl) {
          throw new Error("Missing VITE_CONVEX_URL environment variable");
        }

        const baseUrl = convexUrl.includes(".convex.cloud")
          ? convexUrl.replace(".convex.cloud", ".convex.site")
          : convexUrl;
        const endpoint = `${baseUrl}/api/assistent/getClassSuggestions`;

        console.log("[ClassSuggestions] Fetching from:", endpoint);

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            componentCode,
            nodeId,
            currentClasses: classTokens,
          }),
        }).catch((fetchError) => {
          console.error("[ClassSuggestions] Fetch error details:", fetchError);
          console.error("[ClassSuggestions] Endpoint URL:", endpoint);
          console.error("[ClassSuggestions] Convex URL:", convexUrl);
          throw fetchError;
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          throw new Error(`Failed to fetch suggestions: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions as string[]);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("[ClassSuggestions] Error fetching suggestions:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch suggestions");
        setSuggestions([]);
      } finally {
        // No loading state to update
      }
    };

    fetchSuggestions();
  }, [componentCode, nodeId, classTokens.join(" "), selectedNodeAstPosition, token]);

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
      console.error("[ClassSuggestions] Error handling suggestion:", err);
    }
  };

  if (!nodeId || !selectedNodeAstPosition) {
    return null;
  }

  if (error) {
    return null;
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <AsideSection title="Suggestions" contentGap="small">
      {suggestions.map((suggestion) => (
        <ClassSuggestionComponent key={suggestion} suggestion={suggestion} onClick={handleSuggestionClick} />
      ))}
    </AsideSection>
  );
}
