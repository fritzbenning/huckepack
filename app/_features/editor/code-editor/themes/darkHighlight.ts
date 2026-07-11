import { HighlightStyle } from "@codemirror/language";
import { tags } from "@lezer/highlight";

// Dark theme syntax highlighting - using CSS variables with Tailwind 400 colors
export const darkHighlightStyle = HighlightStyle.define([
  // Keywords - blue-400
  { tag: tags.keyword, color: "var(--syntax-keyword)" },
  { tag: tags.operatorKeyword, color: "var(--syntax-keyword)" },
  { tag: tags.controlKeyword, color: "var(--syntax-keyword)" },
  { tag: tags.definitionKeyword, color: "var(--syntax-keyword)" },
  { tag: tags.modifier, color: "var(--syntax-keyword)" },

  // Comments - gray-400
  { tag: tags.comment, color: "var(--syntax-comment)", fontStyle: "italic" },
  { tag: tags.lineComment, color: "var(--syntax-comment)", fontStyle: "italic" },
  { tag: tags.blockComment, color: "var(--syntax-comment)", fontStyle: "italic" },

  // Strings - emerald-400
  { tag: tags.string, color: "var(--syntax-string)" },

  // Numbers - red-400
  { tag: tags.number, color: "var(--syntax-number)" },

  // Brackets and punctuation - gray-200
  { tag: tags.bracket, color: "var(--syntax-bracket)" },
  { tag: tags.punctuation, color: "var(--syntax-bracket)" },
  { tag: tags.squareBracket, color: "var(--syntax-bracket)" },
  { tag: tags.paren, color: "var(--syntax-bracket)" },
  { tag: tags.brace, color: "var(--syntax-bracket)" },

  // Variables and names - gray-200
  { tag: tags.variableName, color: "var(--syntax-variable)" },
  { tag: tags.propertyName, color: "var(--syntax-property)" },

  // Types and classes - purple-400
  { tag: tags.typeName, color: "var(--syntax-type)" },
  { tag: tags.className, color: "var(--syntax-type)" },
  { tag: tags.namespace, color: "var(--syntax-type)" },

  // Operators - gray-200
  { tag: tags.operator, color: "var(--syntax-operator)" },

  // Tags (for JSX/HTML) - emerald-400
  { tag: tags.tagName, color: "var(--syntax-tag)" },
  { tag: tags.attributeName, color: "var(--syntax-attribute)" },

  // Meta - gray-400
  { tag: tags.meta, color: "var(--syntax-meta)" },
]);
