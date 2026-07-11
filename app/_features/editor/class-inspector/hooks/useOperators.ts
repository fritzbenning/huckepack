import { useMemo } from "react";
import { getValidOperators } from "../utils/getValidOperators";

export function useOperators(propertyType: string | null | undefined) {
  return useMemo(() => getValidOperators(propertyType), [propertyType]);
}
