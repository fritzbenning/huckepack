export function isGradientStopClass(cls: string): boolean {
  if (cls.startsWith("from-")) return true;
  if (cls.startsWith("via-")) return true;
  if (cls.startsWith("to-")) return true;
  return false;
}

