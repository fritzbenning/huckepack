### Class Getter Helper Functions

When defining the `classes` array in a property configuration, several helper functions are available to generate arrays of valid Tailwind classes. These functions make it easy to create comprehensive class lists without manual enumeration.

#### Available Getter Functions

##### `getScaleClasses(prefix, scales)`

Generates classes for Tailwind's scale-based spacing system (multiples of 0.25rem or 4px).

**Signature**: `(prefix: string, scales: number[]) => string[]`

**Parameters**:
- `prefix` - The class prefix (e.g., "w", "p", "m")
- `scales` - Array of scale values (e.g., [0, 1, 2, 4, 8, 16, 32])

**Returns**: Array of classes like `["w-0", "w-1", "w-2", "w-4", "w-8", ...]`

**Example**:
```typescript
getScaleClasses("w", [0, 1, 2, 4, 8, 16, 32, 64])
// Returns: ["w-0", "w-1", "w-2", "w-4", "w-8", "w-16", "w-32", "w-64"]

getScaleClasses("p", TAILWIND_SCALES)  // Using predefined constants
// Returns: ["p-0", "p-0.5", "p-1", "p-1.5", "p-2", ...]
```

---

##### `getFractionClasses(prefix, denominator)`

Generates classes for fractional values (e.g., 1/2, 2/3, 3/4).

**Signature**: `(prefix: string, denominator: number) => string[]`

**Parameters**:
- `prefix` - The class prefix (e.g., "w", "h")
- `denominator` - Maximum denominator for fractions (typically 2, 3, 4, 5, 6, or 12)

**Returns**: Array of fraction classes

**Example**:
```typescript
getFractionClasses("w", 2)
// Returns: ["w-1/2"]

getFractionClasses("w", 3)
// Returns: ["w-1/3", "w-2/3"]

getFractionClasses("w", 12)
// Returns: ["w-1/12", "w-2/12", ..., "w-11/12"]
```

**Common Usage**:
```typescript
classes: [
  ...getFractionClasses("w", 2),   // 1/2
  ...getFractionClasses("w", 3),   // 1/3, 2/3
  ...getFractionClasses("w", 4),   // 1/4, 2/4, 3/4
  ...getFractionClasses("w", 5),   // 1/5, 2/5, 3/5, 4/5
  ...getFractionClasses("w", 6),   // 1/6, 2/6, ..., 5/6
  ...getFractionClasses("w", 12),  // 1/12, 2/12, ..., 11/12
]
```

---

##### `getEnumClasses(prefix, values)`

Generates classes for enumerated string values (e.g., "auto", "full", "none").

**Signature**: `(prefix: string, values: string[]) => string[]`

**Parameters**:
- `prefix` - The class prefix (e.g., "w", "overflow", "position")
- `values` - Array of enum value strings

**Returns**: Array of classes with prefix and values joined

**Example**:
```typescript
getEnumClasses("w", ["auto", "full", "screen", "fit", "min", "max"])
// Returns: ["w-auto", "w-full", "w-screen", "w-fit", "w-min", "w-max"]

getEnumClasses("overflow", ["auto", "hidden", "visible", "scroll"])
// Returns: ["overflow-auto", "overflow-hidden", "overflow-visible", "overflow-scroll"]

getEnumClasses("position", ["static", "fixed", "absolute", "relative", "sticky"])
// Returns: ["position-static", "position-fixed", ...]
```

---

##### `getTokenClasses(prefix, tokenMap)`

Generates classes for design token values (named size tokens from a token map).

**Signature**: `(prefix: string, tokenMap: TokenMap) => string[]`

**Parameters**:
- `prefix` - The class prefix (e.g., "w", "text", "rounded")
- `tokenMap` - Object mapping token names to pixel values

**Returns**: Array of token classes

**Example**:
```typescript
const TAILWIND_MAX_WIDTH_TOKENS = {
  "xs": 320,
  "sm": 384,
  "md": 448,
  "lg": 512,
  "xl": 576,
  "2xl": 672,
  "3xl": 768
};

getTokenClasses("max-w", TAILWIND_MAX_WIDTH_TOKENS)
// Returns: ["max-w-xs", "max-w-sm", "max-w-md", "max-w-lg", ...]

const FONT_SIZE_TOKENS = {
  "xs": 12,
  "sm": 14,
  "base": 16,
  "lg": 18,
  "xl": 20
};

getTokenClasses("text", FONT_SIZE_TOKENS)
// Returns: ["text-xs", "text-sm", "text-base", "text-lg", "text-xl"]
```

---

#### Complete Property Example with All Getters

Here's a comprehensive example using all available getter functions:

```typescript
import { 
  getScaleClasses, 
  getFractionClasses, 
  getEnumClasses, 
  getTokenClasses 
} from "@editor/design/values";

const TAILWIND_SCALES = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 56, 64];

const MAX_WIDTH_TOKENS = {
  "xs": 320,
  "sm": 384,
  "md": 448,
  "lg": 512,
  "xl": 576,
  "2xl": 672
};

export const config = {
  features: {
    width: {
      type: "numeric",
      prefix: "w",
      classes: [
        // Scale-based classes: w-0, w-0.5, w-1, w-1.5, ...
        ...getScaleClasses("w", TAILWIND_SCALES),
        
        // Fraction classes: w-1/2, w-1/3, w-2/3, w-1/4, ...
        ...getFractionClasses("w", 2),
        ...getFractionClasses("w", 3),
        ...getFractionClasses("w", 4),
        ...getFractionClasses("w", 12),
        
        // Enum classes: w-auto, w-full, w-screen, w-min, w-max, w-fit
        ...getEnumClasses("w", ["auto", "full", "screen", "min", "max", "fit"]),
        
        // Token classes: w-xs, w-sm, w-md, w-lg, w-xl, w-2xl
        ...getTokenClasses("w", MAX_WIDTH_TOKENS)
      ],
      defaultUnit: "scale",
      units: ["scale", "px", "rem", "%", "vw"],
      extensions: {
        enum: {
          values: ["auto", "full", "screen", "min", "max", "fit"],
          defaultValue: "auto"
        },
        tokens: MAX_WIDTH_TOKENS
      }
    }
  }
} satisfies DesignPropertyConfig;
```

#### Usage Tips

1. **Order matters**: Place getters in logical order (scales, fractions, enums, tokens)
2. **Avoid duplicates**: The framework will deduplicate, but it's more efficient to avoid overlaps
3. **Use constants**: Define token maps and scale arrays as constants for reuse
4. **Match extensions**: If using `extensions.tokens`, also use `getTokenClasses` with the same map
5. **Common patterns**:
   - Dimensions: scales + fractions + enums ("auto", "full")
   - Spacing: scales only
   - Typography: scales + tokens
   - Layout: enums only

---
