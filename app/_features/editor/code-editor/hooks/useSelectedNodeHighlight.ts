import type { ThemeMode } from "@application/theme/types";
import type { Extension } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import type { Id } from "@convex/_generated/dataModel";
import { useSelectedNodeData } from "@project/file-manager";
import { useEffect, useEffectEvent, useMemo, useRef } from "react";
import {
  highlightCodeSnippetDarkTheme,
  highlightCodeSnippetEffect,
  highlightCodeSnippetField,
  highlightCodeSnippetTheme,
} from "../extensions/highlightCodeSnippet";
import { computeHighlightRange } from "../utils/computeHighlightRange";

export function useSelectedNodeHighlight(
  code: string,
  projectId: Id<"projects"> | undefined,
  fileId: Id<"files"> | undefined,
  themeMode: ThemeMode
): Extension[] {
  const selectedNodeData = useSelectedNodeData(projectId, fileId);

  const viewRef = useRef<EditorView | null>(null);
  const cachedRangeRef = useRef<{ from: number; to: number } | null>(null);
  const lastDispatchedRef = useRef<{ from: number; to: number } | null>(null);

  const highlightRange = useMemo(() => {
    const range = computeHighlightRange(selectedNodeData, code);
    cachedRangeRef.current = range;

    return range;
  }, [selectedNodeData, code]);

  const applyHighlight = useEffectEvent((range: { from: number; to: number } | null) => {
    if (!viewRef.current) return;

    const docLength = viewRef.current.state.doc.length;

    if (range && range.from >= 0 && range.to > range.from && range.to <= docLength) {
      viewRef.current.dispatch({
        effects: [highlightCodeSnippetEffect.of(range)],
      });
      lastDispatchedRef.current = range;
    } else {
      viewRef.current.dispatch({
        effects: [highlightCodeSnippetEffect.of(null)],
      });
      lastDispatchedRef.current = null;
    }
  });

  const viewExtension = EditorView.updateListener.of((update) => {
    if (update.view) {
      const wasViewNull = viewRef.current === null;
      viewRef.current = update.view;

      if (wasViewNull && cachedRangeRef.current !== null) {
        applyHighlight(cachedRangeRef.current);
      }
    }

    if (update.docChanged && cachedRangeRef.current !== null && lastDispatchedRef.current !== null && update.view) {
      applyHighlight(cachedRangeRef.current);
    }
  });

  useEffect(() => {
    const lastRange = lastDispatchedRef.current;
    const isUnchanged =
      highlightRange && lastRange && highlightRange.from === lastRange.from && highlightRange.to === lastRange.to;

    if (isUnchanged) return;

    applyHighlight(highlightRange);
  }, [highlightRange]);

  const themeExtension = useMemo(
    () => (themeMode === "dark" ? highlightCodeSnippetDarkTheme : highlightCodeSnippetTheme),
    [themeMode]
  );

  return [highlightCodeSnippetField, themeExtension, viewExtension];
}
