import type { Properties } from "@project/ast-parser";
import { useMemo } from "react";

export function usePropertyType(properties: Properties | undefined, property: string | null): string | null {
  return useMemo(() => {
    if (!property || !properties) return null;
    return properties[property]?.type?.kind || null;
  }, [property, properties]);
}

