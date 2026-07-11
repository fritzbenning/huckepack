import type { Id } from "@convex/_generated/dataModel";
import { useAuthToken } from "@convex-dev/auth/react";
import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";
import { useFileReferenceCode } from "@project/file-manager";
import {
  getFileClassSuggestions,
  getFileManagerStore,
  setFileClassSuggestions,
} from "@project/file-manager/stores/fileManagerStore";
import { useCallback, useEffect, useRef, useState } from "react";

const TARGET_SUGGESTION_COUNT = 4;

export function useClassSuggestions(
  projectId: string,
  fileId: string,
  selectedNodeAstPosition: number | null,
  nodeId: string | null,
  classes: StringLiteralClasses | TemplateLiteralClasses | null
): string[] {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const componentCode = useFileReferenceCode(projectId as Id<"projects">, fileId as Id<"files">);
  const token = useAuthToken();
  const prevNodeIdRef = useRef<string | null>(null);
  const prevClassTokensRef = useRef<string[]>([]);

  const classTokens = classes?.classTokens ?? [];
  const prevStoreSuggestionsRef = useRef<string[]>([]);
  const isFetchingRef = useRef(false);

  // Get suggestions from store - read directly to avoid subscription issues
  const getStoreSuggestions = () => {
    if (!nodeId) return [];
    return getFileClassSuggestions(fileId as Id<"files">, nodeId, projectId as Id<"projects">);
  };

  // Extract fetch logic into a reusable function
  const fetchSuggestions = useCallback(
    async (currentSuggestions: string[]) => {
      if (!nodeId || !selectedNodeAstPosition || !componentCode || isFetchingRef.current) {
        return;
      }

      if (currentSuggestions.length >= TARGET_SUGGESTION_COUNT) {
        return;
      }

      isFetchingRef.current = true;

      try {
        const convexUrl = import.meta.env.VITE_CONVEX_URL;
        if (!convexUrl) {
          throw new Error("Missing VITE_CONVEX_URL environment variable");
        }

        const baseUrl = convexUrl.includes(".convex.cloud")
          ? convexUrl.replace(".convex.cloud", ".convex.site")
          : convexUrl;
        const endpoint = `${baseUrl}/api/assistent/getClassSuggestions`;

        console.log("[useClassSuggestions] Fetching from:", endpoint);

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
            existingSuggestions: currentSuggestions.length > 0 ? currentSuggestions : undefined,
          }),
        }).catch((fetchError) => {
          console.error("[useClassSuggestions] Fetch error details:", fetchError);
          console.error("[useClassSuggestions] Endpoint URL:", endpoint);
          console.error("[useClassSuggestions] Convex URL:", convexUrl);
          throw fetchError;
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          throw new Error(`Failed to fetch suggestions: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        if (data.suggestions && Array.isArray(data.suggestions)) {
          const newSuggestions = data.suggestions as string[];
          // Merge existing with new suggestions, limit to TARGET_SUGGESTION_COUNT
          const merged = [...currentSuggestions, ...newSuggestions].slice(0, TARGET_SUGGESTION_COUNT);
          setFileClassSuggestions(fileId as Id<"files">, nodeId, merged, projectId as Id<"projects">);
          setSuggestions(merged);
          prevStoreSuggestionsRef.current = merged;
        } else {
          // If no new suggestions, keep existing ones
          setSuggestions(currentSuggestions);
        }
      } catch (err) {
        console.error("[useClassSuggestions] Error fetching suggestions:", err);
        // On error, keep existing suggestions
        setSuggestions(currentSuggestions);
      } finally {
        isFetchingRef.current = false;
      }
    },
    [componentCode, nodeId, classTokens, selectedNodeAstPosition, token, fileId, projectId]
  );

  useEffect(() => {
    if (!nodeId || !selectedNodeAstPosition || !componentCode) {
      setSuggestions([]);
      prevNodeIdRef.current = null;
      return;
    }

    // Invalidate suggestions when node changes significantly
    if (prevNodeIdRef.current !== nodeId) {
      prevNodeIdRef.current = nodeId;
      const stored = getFileClassSuggestions(fileId as Id<"files">, nodeId, projectId as Id<"projects">);
      setSuggestions(stored);
      prevClassTokensRef.current = [...classTokens];
      return;
    }

    const classTokensStr = classTokens.join(" ");
    const prevClassTokensStr = prevClassTokensRef.current.join(" ");

    // Only refetch if classes changed significantly (not just minor changes)
    if (classTokensStr === prevClassTokensStr) {
      // Update local state from store if it changed
      const stored = getStoreSuggestions();
      if (
        stored.length !== suggestions.length ||
        stored.some((s: string, i: number) => JSON.stringify(s) !== JSON.stringify(suggestions[i]))
      ) {
        setSuggestions(stored);
        prevStoreSuggestionsRef.current = stored;
      }
      return;
    }

    prevClassTokensRef.current = [...classTokens];

    // Get current suggestions from store
    const currentSuggestions = getStoreSuggestions();

    // Only fetch if we have less than TARGET_SUGGESTION_COUNT suggestions
    if (currentSuggestions.length >= TARGET_SUGGESTION_COUNT) {
      setSuggestions(currentSuggestions);
      prevStoreSuggestionsRef.current = currentSuggestions;
      return;
    }

    fetchSuggestions(currentSuggestions);
  }, [
    componentCode,
    nodeId,
    classTokens.join(" "),
    selectedNodeAstPosition,
    token,
    fileId,
    projectId,
    fetchSuggestions,
  ]);

  // Sync with store changes using store subscription and refetch if count drops below target
  useEffect(() => {
    if (!nodeId || !selectedNodeAstPosition || !componentCode) return;

    const store = getFileManagerStore(projectId as Id<"projects">);

    const unsubscribe = store.subscribe((state) => {
      const stored = state.files[fileId as Id<"files">]?.classSuggestions?.[nodeId] || [];
      const prevStored = prevStoreSuggestionsRef.current;

      // Only update if actually changed (deep comparison)
      const storedStr = JSON.stringify(stored);
      const prevStoredStr = JSON.stringify(prevStored);

      if (storedStr !== prevStoredStr) {
        console.log("[useClassSuggestions] Store changed via subscription, updating state", {
          stored,
          prevStored,
          storedLength: stored.length,
        });
        setSuggestions((current) => {
          const currentStr = JSON.stringify(current);
          if (storedStr !== currentStr) {
            prevStoreSuggestionsRef.current = stored;

            // If suggestions dropped below target, trigger refetch
            if (stored.length < TARGET_SUGGESTION_COUNT && prevStored.length >= stored.length) {
              console.log(
                `[useClassSuggestions] Suggestions dropped from ${prevStored.length} to ${stored.length}, triggering refetch`
              );
              // Use setTimeout to avoid calling fetchSuggestions during render
              setTimeout(() => {
                fetchSuggestions(stored);
              }, 0);
            }

            return stored;
          }
          return current;
        });
      }
    });

    return unsubscribe;
  }, [nodeId, fileId, projectId, selectedNodeAstPosition, componentCode, fetchSuggestions]);

  return suggestions;
}
