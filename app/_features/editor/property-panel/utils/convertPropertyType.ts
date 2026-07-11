import type { PropertyTypeKind } from "@ast/types/create/createTsType";

export type PropertyTypeOption = PropertyTypeKind | "union" | "instance";

export const PROPERTY_TYPES: { value: PropertyTypeOption; label: string }[] = [
  { value: "string", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Toggle" },
  { value: "union", label: "Variant" },
  { value: "instance", label: "Instance" },
];

export const CHILDREN_TYPES: { value: PropertyTypeOption; label: string }[] = [
  { value: "string", label: "Text" },
  { value: "instance", label: "Instance" },
];

export function convertPropertyValue(
  value: string | number | boolean | null | undefined,
  fromType: string,
  toType: PropertyTypeOption
): string | number | boolean | null {
  if (value === null || value === undefined) {
    // Return default values for each type
    switch (toType) {
      case "string":
        return "";
      case "number":
        return 0;
      case "boolean":
        return false;
      case "instance":
        return "";
      default:
        return null;
    }
  }

  // If types are the same, return as-is
  if (fromType === toType) {
    return value;
  }

  // Convert to string
  if (toType === "string") {
    return String(value);
  }

  // Convert to number
  if (toType === "number") {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "boolean") {
      return value ? 1 : 0;
    }
    const num = Number(value);
    return Number.isNaN(num) ? 0 : num;
  }

  // Convert to boolean
  if (toType === "boolean") {
    if (typeof value === "boolean") {
      return value;
    }
    if (typeof value === "number") {
      return value !== 0;
    }
    if (typeof value === "string") {
      return value === "true" || value === "1" || value.toLowerCase() === "yes";
    }
    return Boolean(value);
  }

  // Convert to instance
  if (toType === "instance") {
    return String(value);
  }

  // Default: preserve the value
  return value;
}
