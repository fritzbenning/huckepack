import type { ClassNormalizer, Normalizer } from "./types";

interface CreateClassNormalizerParams {
  property: string;
  normalizers: Normalizer[];
}

export function createClassNormalizer({ property, normalizers }: CreateClassNormalizerParams): ClassNormalizer {
  return {
    property,
    normalizers,
    normalize(value: number, unit: string): string {
      const normalizer = normalizers.find((n) => n.matches(value, unit) && n.preservesUnit(value, unit));

      if (!normalizer) {
        return `${property}-[${value}${unit}]`;
      }
      return normalizer.format(value, unit);
    },
  };
}
