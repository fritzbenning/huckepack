export function matchesTextAlign(cls: string): boolean {
  return (
    cls.startsWith("text-left") ||
    cls.startsWith("text-center") ||
    cls.startsWith("text-right") ||
    cls.startsWith("text-justify") ||
    cls.startsWith("text-start") ||
    cls.startsWith("text-end")
  );
}

