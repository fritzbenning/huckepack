import type { PropertyType } from "../types";
import { getOperatorConfig } from "./getOperatorConfig";

export function getValidOperators(propertyType: string | null | undefined) {
  const config = getOperatorConfig(propertyType as PropertyType, null, null);
  return config.availableOperators;
}
