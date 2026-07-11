export function normalizeQuasiValue(
  value: string,
  options: {
    hasPrecedingExpression?: boolean;
    hasFollowingExpression?: boolean;
  } = {}
): string {
  const { hasPrecedingExpression = false, hasFollowingExpression = false } = options;

  // Normalize whitespace: split by spaces, filter empty, join with single space
  const normalized = value.split(/\s+/).filter(Boolean).join(" ").trim();

  // If empty, return appropriate spacing based on context
  if (!normalized) {
    if (hasPrecedingExpression && hasFollowingExpression) {
      // Between two expressions, return a single space
      return " ";
    }
    if (hasPrecedingExpression || hasFollowingExpression) {
      // Before or after an expression, return a single space
      return " ";
    }
    // No expressions nearby, return empty
    return "";
  }

  // Add leading space if this quasi comes after an expression
  const withLeadingSpace = hasPrecedingExpression ? ` ${normalized}` : normalized;

  // Add trailing space if this quasi comes before an expression
  const withTrailingSpace = hasFollowingExpression ? `${withLeadingSpace} ` : withLeadingSpace;

  return withTrailingSpace;
}
