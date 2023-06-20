export type ColorVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";

export type SizeVariant = "xs" | "sm" | "md" | "lg";

export const COLOR_VARIANTS: ColorVariant[] = [
  "primary",
  "secondary",
  "accent",
  "neutral",
  "info",
  "success",
  "warning",
  "error",
];

export const SIZE_VARIANTS: SizeVariant[] = ["xs", "sm", "md", "lg"];

/**
 * Type-guard to check if a given variant is a valid color variant
 *
 * @param variant - The variant to check
 * @returns - True if the variant is a valid color variant
 */
export const isColorVariant = (variant: any): variant is ColorVariant =>
  COLOR_VARIANTS.includes(variant as ColorVariant);

/**
 * Type-guard to check if a given variant is a valid size variant
 * @param variant - The variant to check
 * @returns - True if the variant is a valid size variant
 */
export const isSizeVariant = (variant: any): variant is SizeVariant =>
  SIZE_VARIANTS.includes(variant as SizeVariant);
