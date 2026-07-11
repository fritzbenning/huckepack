export interface Normalizer {
  name: string;
  matches: (value: number, unit: string) => boolean;
  format: (value: number, unit: string) => string;
  preservesUnit: (value: number, unit: string) => boolean;
}

export interface ClassNormalizer {
  property: string;
  normalizers: Normalizer[];
  normalize(value: number, unit: string): string;
}
