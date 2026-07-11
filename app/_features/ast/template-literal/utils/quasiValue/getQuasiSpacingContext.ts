/**
 * Calculates spacing context for a quasi at the given index.
 */
export function getQuasiSpacingContext(
  quasiIndex: number,
  totalExpressions: number
): { hasPrecedingExpression: boolean; hasFollowingExpression: boolean } {
  return {
    hasPrecedingExpression: quasiIndex > 0,
    hasFollowingExpression: quasiIndex < totalExpressions,
  };
}

