import { splitStringLiteral } from "@ast/string-literal/format";
import type { StringLiteral } from "@swc/wasm-web";
import type { StringLiteralClasses } from "../../types";

export const processStringLiteral = (classes: StringLiteral): StringLiteralClasses => {
  const rawTokens: string[] = splitStringLiteral(classes.value);
  const classTokens: string[] = rawTokens;

  return {
    type: "StringLiteral",
    classTokens,
    value: classes.value,
    span: classes.span,
  };
};
