import type { hasPropsSpread } from "@ast/jsx";

export type JSXOpeningElement = Parameters<typeof hasPropsSpread>[0];
