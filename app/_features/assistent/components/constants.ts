import type { CSSProperties } from "react";

type HighlightTheme = Record<string, CSSProperties>;
const lightText = "#0f172a";
const lightMuted = "#64748b";
const lightPrimary = "#6366f1";
const lightAccent = "#0ea5e9";
const lightString = "#059669";
const lightNumber = "#ea580c";
const lightType = "#9333ea";
const lightMeta = "#0891b2";

const darkText = "#e2e8f0";
const darkMuted = "#94a3b8";
const darkPrimary = "#a5b4fc";
const darkAccent = "#38bdf8";
const darkString = "#34d399";
const darkNumber = "#fbbf24";
const darkType = "#c084fc";
const darkMeta = "#22d3ee";

const lightRootStyle: CSSProperties = {
  display: "block",
  background: "transparent",
  color: lightText,
  lineHeight: "1.5",
};

const darkRootStyle: CSSProperties = {
  display: "block",
  background: "transparent",
  color: darkText,
  lineHeight: "1.5",
};

export const toolIndicatorLightHighlightTheme: HighlightTheme = {
  hljs: lightRootStyle,
  "hljs-comment": { color: lightMuted, fontStyle: "italic" },
  "hljs-quote": { color: lightMuted, fontStyle: "italic" },
  "hljs-keyword": { color: lightPrimary, fontWeight: 600 },
  "hljs-selector-tag": { color: lightPrimary, fontWeight: 600 },
  "hljs-section": { color: lightPrimary, fontWeight: 600 },
  "hljs-name": { color: lightPrimary },
  "hljs-literal": { color: lightAccent },
  "hljs-subst": { color: lightText },
  "hljs-string": { color: lightString },
  "hljs-regexp": { color: lightString },
  "hljs-addition": { color: "#16a34a" },
  "hljs-attribute": { color: lightAccent },
  "hljs-attr": { color: "#d97706" },
  "hljs-number": { color: lightNumber },
  "hljs-symbol": { color: lightAccent },
  "hljs-bullet": { color: "#22c55e" },
  "hljs-variable": { color: lightText },
  "hljs-template-variable": { color: lightText },
  "hljs-type": { color: lightType },
  "hljs-built_in": { color: "#d946ef" },
  "hljs-builtin-name": { color: "#d946ef" },
  "hljs-class .hljs-title": { color: lightType },
  "hljs-strong": { fontWeight: 700 },
  "hljs-title": { color: lightAccent },
  "hljs-tag": { color: lightPrimary },
  "hljs-emphasis": { fontStyle: "italic" },
  "hljs-meta": { color: lightMeta },
  "hljs-meta-string": { color: lightString },
  "hljs-deletion": { color: "#ef4444" },
  "hljs-link": { color: lightPrimary, textDecoration: "underline" },
};

export const toolIndicatorDarkHighlightTheme: HighlightTheme = {
  hljs: darkRootStyle,
  "hljs-comment": { color: darkMuted, fontStyle: "italic" },
  "hljs-quote": { color: darkMuted, fontStyle: "italic" },
  "hljs-keyword": { color: darkPrimary, fontWeight: 600 },
  "hljs-selector-tag": { color: darkPrimary, fontWeight: 600 },
  "hljs-section": { color: darkPrimary, fontWeight: 600 },
  "hljs-name": { color: darkPrimary },
  "hljs-literal": { color: darkAccent },
  "hljs-subst": { color: darkText },
  "hljs-string": { color: darkString },
  "hljs-regexp": { color: darkString },
  "hljs-addition": { color: "#4ade80" },
  "hljs-attribute": { color: darkAccent },
  "hljs-attr": { color: "#fbbf24" },
  "hljs-number": { color: darkNumber },
  "hljs-symbol": { color: darkAccent },
  "hljs-bullet": { color: "#86efac" },
  "hljs-variable": { color: darkText },
  "hljs-template-variable": { color: darkText },
  "hljs-type": { color: darkType },
  "hljs-built_in": { color: "#f0abfc" },
  "hljs-builtin-name": { color: "#f0abfc" },
  "hljs-class .hljs-title": { color: darkType },
  "hljs-strong": { fontWeight: 700 },
  "hljs-title": { color: darkAccent },
  "hljs-tag": { color: darkPrimary },
  "hljs-emphasis": { fontStyle: "italic" },
  "hljs-meta": { color: darkMeta },
  "hljs-meta-string": { color: darkString },
  "hljs-deletion": { color: "#f87171" },
  "hljs-link": { color: darkPrimary, textDecoration: "underline" },
};
