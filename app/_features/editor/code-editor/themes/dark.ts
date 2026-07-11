import { EditorView } from "@uiw/react-codemirror";

// Dark theme - clean dark background
export const darkTheme = EditorView.theme(
  {
    "&": {
      color: "var(--color-white)",
      backgroundColor: "var(--color-neutral-900)",
      fontSize: "12px",
      fontFamily: "var(--font-mono)",
      // borderLeft: "1px solid var(--color-neutral-800)",
    },
    ".cm-content": {
      caretColor: "var(--color-neutral-200)",
      padding: "20px 0",
    },
    ".cm-line": {
      lineHeight: "1.5",
      paddingLeft: "1rem",
    },
    "&.cm-focused": {
      outline: "none",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "var(--color-neutral-200)",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "var(--color-neutral-800)",
    },
    ".cm-selectionBackground": {
      backgroundColor: "var(--color-neutral-800)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-neutral-950)",
      color: "var(--color-neutral-750)",
      border: "none",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      minWidth: "32px",
      color: "var(--color-neutral-650)",
      paddingLeft: "0.75rem",
      paddingRight: "0.25rem",
    },
    ".cm-gutterElement": {
      display: "flex",
      alignItems: "center",
    },
    ".cm-activeLine": {
      backgroundColor: "var(--color-neutral-800)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--color-neutral-900)",
      color: "var(--color-white) !important",
    },
    ".cm-foldGutter span": {
      width: "1rem",
      height: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "0.5rem",
      cursor: "pointer",
      backgroundColor: "var(--color-neutral-950)",
      fontSize: "0",
      borderRadius: "0.25rem",
      transformOrigin: "center",
    },
    ".cm-foldGutter span::before": {
      content: '"›"',
      fontSize: "14px",
      color: "var(--color-neutral-400)",
      transition: "transform 0.2s ease-in-out",
    },
    ".cm-foldGutter span[title='Fold line']::before": {
      transform: "rotate(0deg) translateY(-0.3px)",
    },
    ".cm-foldGutter span[title='Unfold line']::before": {
      transform: "rotate(90deg) translateY(-0.2px)",
    },
  },
  { dark: true }
);
