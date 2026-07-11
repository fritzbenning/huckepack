export function matchesBackgroundImage(cls: string): boolean {
  if (cls === "bg-none") return true;
  if (cls.startsWith("bg-linear-")) return true;
  if (cls.startsWith("bg-radial")) return true;
  if (cls.startsWith("bg-conic")) return true;
  if (cls.startsWith("bg-gradient-")) return true;
  if (cls.startsWith("bg-[url(")) return true;
  if (cls.startsWith("bg-[image:")) return true;
  if (/^bg-\[url\(['"]?/.test(cls)) return true;
  return false;
}

