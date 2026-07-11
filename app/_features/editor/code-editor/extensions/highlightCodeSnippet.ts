import { StateEffect, StateField } from "@codemirror/state";
import { Decoration, EditorView } from "@codemirror/view";

export const highlightCodeSnippetEffect = StateEffect.define<{ from: number; to: number } | null>();

export const highlightCodeSnippetField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    let newDeco = decorations.map(tr.changes);

    for (const effect of tr.effects) {
      if (effect.is(highlightCodeSnippetEffect)) {
        if (effect.value === null) {
          newDeco = Decoration.none;
        } else {
          const { from, to } = effect.value;
          const docLength = tr.state.doc.length;
          const clampedFrom = Math.min(Math.max(0, from), docLength);
          const clampedTo = Math.min(Math.max(clampedFrom, to), docLength);

          const rangeDecoration = Decoration.mark({
            class: "cm-selected-node-highlight",
          });

          newDeco = Decoration.set([rangeDecoration.range(clampedFrom, clampedTo)]);
        }
      }
    }

    return newDeco;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export const highlightCodeSnippetTheme = EditorView.theme({
  ".cm-selected-node-highlight": {
    backgroundColor: "rgba(99, 102, 241, 0.15) !important",
    display: "inline-block",
  },
});

export const highlightCodeSnippetDarkTheme = EditorView.theme({
  ".cm-selected-node-highlight": {
    backgroundColor: "rgba(99, 102, 241, 0.3) !important",
    display: "inline-block",
  },
});
