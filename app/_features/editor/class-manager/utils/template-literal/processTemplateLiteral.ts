import { splitStringLiteral } from "@ast/string-literal/format";
import type { TemplateLiteral } from "@swc/wasm-web";
import type { QuasisSegment, TemplateLiteralClasses, TemplateLiteralSegment } from "../../types";
import { processExpression } from "./processExpression";

export const processTemplateLiteral = (templateLiteral: TemplateLiteral): TemplateLiteralClasses => {
  const segments: TemplateLiteralSegment[] = [];
  const allClassTokens: string[] = [];

  for (const [i, quasi] of templateLiteral.quasis.entries()) {
    const quasiValue = quasi.cooked || quasi.raw || "";
    const quasiClasses = quasiValue.trim() ? splitStringLiteral(quasiValue) : [];

    if (quasiClasses.length > 0) {
      const quasiSegment: QuasisSegment = {
        kind: "quasi",
        classTokens: quasiClasses,
        raw: quasi.raw || "",
        tail: quasi.tail,
        span: quasi.span,
      };
      segments.push(quasiSegment);
      allClassTokens.push(...quasiClasses);
    }

    if (i < templateLiteral.expressions.length) {
      const expr = templateLiteral.expressions[i];
      const expressionSegment = processExpression(expr);
      segments.push(expressionSegment);
    }
  }

  return {
    type: "TemplateLiteral",
    classTokens: allClassTokens,
    segments,
    span: templateLiteral.span,
  };
};
