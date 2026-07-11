export function extractVariant(className: string): { variant: string; base: string } {
  const variantMatch = className.match(/^([a-z@-]+:)?(.+)$/);
  if (!variantMatch) {
    return { variant: "", base: className };
  }
  return {
    variant: variantMatch[1] || "",
    base: variantMatch[2] || className,
  };
}

