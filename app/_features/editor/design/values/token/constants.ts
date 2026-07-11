import type { TokenMap } from "./types";

/**
 * Default Tailwind border-radius tokens
 * Based on Tailwind CSS v4 default values
 */
export const TAILWIND_ROUNDED_TOKENS: TokenMap = {
  none: 0,
  xs: 2,
  sm: 4,
  normal: 4, // "rounded" defaults to sm
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  "4xl": 32,
  full: Infinity, // Special case for rounded-full
};

/**
 * Default Tailwind max-width tokens
 * Based on Tailwind CSS v4 container scale
 */
export const TAILWIND_MAX_WIDTH_TOKENS: TokenMap = {
  "3xs": 256,
  "2xs": 288,
  xs: 320,
  sm: 384,
  md: 448,
  lg: 512,
  xl: 576,
  "2xl": 672,
  "3xl": 768,
  "4xl": 896,
  "5xl": 1024,
  "6xl": 1152,
  "7xl": 1280,
};

/**
 * Default Tailwind font-size tokens
 * Based on Tailwind CSS v4 default values (font-size only, not line-height)
 */
export const TAILWIND_FONT_SIZE_TOKENS: TokenMap = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
  "5xl": 48,
  "6xl": 60,
  "7xl": 72,
  "8xl": 96,
  "9xl": 128,
};

/**
 * Default Tailwind box-shadow tokens
 * Based on Tailwind CSS v4 default values
 * Note: Shadow values are more complex, this is a simplified representation
 */
export const TAILWIND_SHADOW_TOKENS: TokenMap = {
  sm: 2,
  DEFAULT: 4,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  inner: 2,
  none: 0,
};
