import { createClassNormalizer } from "@editor/design/shared/helpers/normalizer";

export const zIndexNormalizer = createClassNormalizer({
  property: "z",
  normalizers: [
    {
      name: "scale",
      matches: (_value, unit) => unit === "scale",
      format: (value) => `z-${value}`,
      preservesUnit: (_value, unit) => unit === "scale",
    },
    {
      name: "arbitrary",
      matches: () => true,
      format: (value) => `z-[${value}]`,
      preservesUnit: () => true,
    },
  ],
});
