export type ParsedColorClass = {
  color?: string;
  shade?: number;
  opacity?: number;
  keyword?: string;
  isArbitrary: boolean;
  arbitraryValue?: string;
};

// Parses a Tailwind-style color class name (e.g., "bg-red-500" or "bg-red-500/80") into its components
// Examples:
//   extractColorValue("bg-red-500", "bg") => { color: "red", shade: 500, isArbitrary: false }
//   extractColorValue("bg-red", "bg") => { keyword: "red", isArbitrary: false }
//   extractColorValue("bg-red-500-80", "bg") => { color: "red", shade: 500, opacity: 80, isArbitrary: false }
//   extractColorValue("bg-[#ff0000]", "bg") => { isArbitrary: true, arbitraryValue: "#ff0000" }
//   extractColorValue("text-blue", "bg") => null
export function extractColorValue(className: string, prefix: string): ParsedColorClass | null {
  if (!className.startsWith(prefix)) {
    return null;
  }

  const suffix = className.slice(prefix.length + 1);

  // Handle arbitrary values like "bg-[#ff0000]"
  if (className.includes("[") && className.includes("]")) {
    const match = className.match(/\[([^\]]+)\]/);
    if (match) {
      return {
        isArbitrary: true,
        arbitraryValue: match[1],
      };
    }
  }

  const parts = suffix.split("-");

  // Handle single keyword like "bg-red"
  if (parts.length === 1) {
    return {
      keyword: parts[0],
      isArbitrary: false,
    };
  }

  // Handle color with shade like "bg-red-500"
  if (parts.length === 2) {
    const shade = parseInt(parts[1], 10);
    if (!Number.isNaN(shade)) {
      return {
        color: parts[0],
        shade,
        isArbitrary: false,
      };
    }
  }

  // Handle color with shade and opacity like "bg-red-500-80"
  if (parts.length === 3 && parts[2]) {
    const shade = parseInt(parts[1], 10);
    const opacity = parseInt(parts[2], 10);
    if (!Number.isNaN(shade) && !Number.isNaN(opacity)) {
      return {
        color: parts[0],
        shade,
        opacity,
        isArbitrary: false,
      };
    }
  }

  return null;
}
