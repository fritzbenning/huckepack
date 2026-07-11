export const OPERATOR_OPTIONS = [
  { value: "===", label: "equals" },
  { value: "!==", label: "is not equal" },
  { value: "<", label: "is below" },
  { value: ">", label: "is above" },
  { value: "<=", label: "is at most" },
  { value: ">=", label: "is at least" },
  { value: "&&", label: "has value" },
  { value: "!&&", label: "has no value" },
];

export const EQUALITY_OPERATORS = ["===", "!=="];

export const NUMBER_OPERATORS = ["===", "!==", "<", ">", "<=", ">="];

export const DEFINED_CHECK_OPERATORS = ["&&", "!&&"];

export const BOOLEAN_OPTIONS = [
  { value: "true", label: "true" },
  { value: "false", label: "false" },
];

export const HELPER_PREFIXES = [
  "hover:",
  "focus:",
  "active:",
  "disabled:",
  "group-hover:",
  "group-focus:",
  "focus-within:",
  "focus-visible:",
  "visited:",
  "target:",
  "first:",
  "last:",
  "odd:",
  "even:",
  "first-child:",
  "last-child:",
  "only-child:",
  "empty:",
  "checked:",
  "default:",
  "required:",
  "valid:",
  "invalid:",
  "in-range:",
  "out-of-range:",
  "indeterminate:",
  "placeholder-shown:",
  "autofill:",
  "read-only:",
  "before:",
  "after:",
  "first-letter:",
  "first-line:",
  "marker:",
  "selection:",
  "backdrop:",
  "placeholder:",
  "file:",
  "dark:",
  "light:",
  "md:",
  "lg:",
  "xl:",
  "2xl:",
  "sm:",
  "@sm/",
  "@md/",
  "@lg/",
  "@xl/",
  "@2xl/",
  "portrait:",
  "landscape:",
  "motion-safe:",
  "motion-reduce:",
  "print:",
  "supports:",
];

export const CATEGORY_PATTERNS: Array<{ category: string; sortOrder: number; patterns: RegExp[] }> = [
  // Layout (Spacing, Sizing, Flex, Grid, Positioning, Display, Overflow)
  {
    category: "Layout",
    sortOrder: 1,
    patterns: [
      // Spacing
      /^(m-|mt-|mr-|mb-|ml-|mx-|my-|p-|pt-|pr-|pb-|pl-|px-|py-)/,
      // Sizing
      /^(w-|h-|max-w-|max-h-|min-w-|min-h-|size-)/,
      // Flexbox
      /^flex/,
      /^(grow|shrink|basis)/,
      /^(justify-|items-|self-|content-|gap-|order-)/,
      // Grid
      /^grid/,
      /^(col-|row-|auto-cols-|auto-rows-)/,
      // Positioning
      /^(relative|absolute|fixed|sticky|static)/,
      /^(top-|right-|bottom-|left-|inset-|z-)/,
      // Display
      /^(block|inline|table|flow-root|contents|list-item|hidden|aspect-|container)/,
      /^(display-)/,
      // Overflow
      /^(overflow|scroll-|snap-)/,
    ],
  },
  // Appearance (Background, Borders, Outline, Opacity, Visibility)
  {
    category: "Appearance",
    sortOrder: 2,
    patterns: [
      // Background
      /^(bg-|background-)/,
      /^(bg-blend-|bg-attachment-|bg-clip-|bg-origin-|bg-position-|bg-repeat-|bg-size-)/,
      // Borders
      /^(border|rounded)/,
      /^(border-[trblxy]-)/,
      /^(divide-)/,
      // Outline
      /^(outline)/,
      // Opacity
      /^(opacity)/,
      // Object fit
      /^(object-)/,
      // Visibility
      /^(visible|invisible|line-clamp-|truncate)/,
    ],
  },
  // Transforms
  {
    category: "Transforms",
    sortOrder: 3,
    patterns: [/^(transform|translate-|rotate-|scale-|skew-|origin-)/],
  },
  // Typography
  {
    category: "Typography",
    sortOrder: 4,
    patterns: [/^(font-|text-|leading-|tracking-|indent-|whitespace-|break-|hyphens-|word-)/],
  },
  // Effects & Shadows
  {
    category: "Effects",
    sortOrder: 5,
    patterns: [
      /^(shadow|mix-blend-|blur-|brightness-|contrast-|drop-shadow-|grayscale-|hue-rotate-|invert-|saturate-|sepia-)/,
    ],
  },
  // Behavior
  {
    category: "Behavior",
    sortOrder: 6,
    patterns: [/^(cursor-|pointer-events-|resize-|select-|touch-|user-select-)/],
  },
  // Motion
  {
    category: "Motion",
    sortOrder: 7,
    patterns: [/^(transition|duration-|delay-|ease-|animate-)/],
  },
  // SVG & Strokes
  {
    category: "SVG",
    sortOrder: 8,
    patterns: [/^(fill-|stroke-)/],
  },
];
