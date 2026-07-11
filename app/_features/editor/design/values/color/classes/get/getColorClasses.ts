const TAILWIND_COLORS = [
  "slate",
  "gray",
  "zinc",
  "neutral",
  "stone",
  "red",
  "orange",
  "amber",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
] as const;

const TAILWIND_SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export function getColorClasses(prefix: string, keywords: string[] = []): string[] {
  const classes: string[] = [];

  for (const color of TAILWIND_COLORS) {
    for (const shade of TAILWIND_SHADES) {
      classes.push(`${prefix}-${color}-${shade}`);
    }
  }

  for (const keyword of keywords) {
    classes.push(`${prefix}-${keyword}`);
  }

  return classes;
}

