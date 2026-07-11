import type { ClassName } from "../types";

export const ClassNamePreset = {
  type: "StringLiteral" as const,
  classTokens: [],
  raw: {
    value: "",
    span: { start: 0, end: 0, ctxt: 0 },
  },
} satisfies ClassName;
