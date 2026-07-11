import type { StringLiteralClasses, TemplateLiteralClasses } from "@editor/class-manager";

interface UseClassTokensParams {
  classes: StringLiteralClasses | TemplateLiteralClasses | null;
}

/**
 * Simple hook that extracts classTokens from the classes object.
 * Use this when you only need classTokens and don't need the utility functions from useDesignProperty.
 */
export function useClassTokens({ classes }: UseClassTokensParams): string[] | null {
  return classes?.classTokens ?? null;
}

