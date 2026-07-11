import { EditorView } from "@uiw/react-codemirror";

// Light theme - clean white background
export const lightTheme = EditorView.theme(
  {
    "&": {
      color: "var(--color-neutral-950)",
      backgroundColor: "var(--color-white)",
      fontSize: "12px",
      fontFamily: "var(--font-mono)",
      borderLeft: "1px solid var(--color-neutral-100)",
    },
    ".cm-content": {
      caretColor: "var(--color-neutral-850)",
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
      borderLeftColor: "var(--color-neutral-850)",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: "var(--color-neutral-100)",
    },
    ".cm-selectionBackground": {
      backgroundColor: "var(--color-neutral-100)",
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-neutral-50)",
      color: "var(--color-neutral-400)",
      border: "none",
    },
    ".cm-lineNumbers .cm-gutterElement": {
      minWidth: "32px",
      color: "var(--color-neutral-400)",
      paddingLeft: "0.75rem",
      paddingRight: "0.25rem",
    },
    ".cm-gutterElement": {
      display: "flex",
      alignItems: "center",
    },
    ".cm-activeLine": {
      backgroundColor: "var(--color-neutral-100)",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--color-neutral-150)",
      color: "var(--color-neutral-950) !important",
    },
    ".cm-foldGutter span": {
      width: "1rem",
      height: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "0.5rem",
      cursor: "pointer",
      backgroundColor: "var(--color-white)",
      fontSize: "0",
      borderRadius: "0.25rem",
      transformOrigin: "center",
    },
    ".cm-foldGutter span::before": {
      content: '"›"',
      fontSize: "14px",
      color: "var(--color-neutral-600)",
      transition: "transform 0.2s ease-in-out",
    },
    ".cm-foldGutter span[title='Fold line']::before": {
      transform: "rotate(0deg) translateY(-0.3px)",
    },
    ".cm-foldGutter span[title='Unfold line']::before": {
      transform: "rotate(90deg) translateY(-0.2px)",
    },
  },
  { dark: false }
);
