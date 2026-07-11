export function isEmptyValue(value: string | number | boolean | null | undefined): boolean {
  return value === null || value === undefined || value === "" || (typeof value === "string" && value.trim() === "");
}

