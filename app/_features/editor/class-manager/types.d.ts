import type { Span } from "@swc/wasm-web";

export type StringLiteralClasses = {
  type: "StringLiteral";
  classTokens: string[];
  value: string;
  span: Span;
};

export type TemplateLiteralClasses = {
  type: "TemplateLiteral";
  classTokens: string[];
  segments: TemplateLiteralSegment[];
  span: Span;
};

export type TemplateLiteralSegment = QuasisSegment | ExpressionSegment;

export type QuasisSegment = {
  kind: "quasi";
  classTokens: string[];
  raw: string;
  tail: boolean;
  span: Span;
};

export type ExpressionSegment = {
  kind: "expression";
  expressionType: "conditional" | "logical-and" | "logical-or" | "unknown";
  span: Span;
} & (ConditionalExpressionSegment | LogicalExpressionSegment | UnknownExpressionSegment);

export type ParsedTestValue = {
  value: string; // Raw value for backwards compatibility
  property: string | null;
  operator: string | null;
  testValue: string | number | boolean | null;
};

export type ConditionalExpressionSegment = {
  expressionType: "conditional";
  test: ParsedTestValue & {
    span: Span;
  };
  consequent: {
    classes: string[];
    raw: string;
    span: Span;
  };
  alternate: {
    classes: string[];
    raw: string;
    span: Span;
  };
};

export type LogicalExpressionSegment = {
  expressionType: "logical-and" | "logical-or";
  test: ParsedTestValue & {
    span: Span;
  };
  operator: "&&" | "||";
  consequent: {
    classes: string[];
    raw: string;
    span: Span;
  };
  alternate: null;
};

export type UnknownExpressionSegment = {
  expressionType: "unknown";
  raw: string;
};
