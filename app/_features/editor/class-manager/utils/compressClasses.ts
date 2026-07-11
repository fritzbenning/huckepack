import { SHORTHAND_REGISTRY } from "@editor/design/registry/shorthands";
import { compressToShorthand, expandShorthandClass, extractSuffix } from "@editor/design/shared/utils";
import { extractVariant } from "./extractVariant";

export function compressClasses(classes: string[]): string[] {
  const result: string[] = [];
  const processed = new Set<string>();
  const sortedMappings = [...SHORTHAND_REGISTRY].sort((a, b) => b.expandsTo.length - a.expandsTo.length);

  for (const cls of classes) {
    if (processed.has(cls)) {
      continue;
    }

    const { variant, base } = extractVariant(cls);
    let compressed = false;

    for (const mapping of sortedMappings) {
      const prefixMatch = mapping.expandsTo.find((prefix) => base.startsWith(`${prefix}-`));
      if (prefixMatch) {
        const suffix = extractSuffix(base, prefixMatch);
        if (suffix) {
          const candidateClasses = mapping.expandsTo
            .map((prefix) => `${variant}${prefix}-${suffix}`)
            .filter((candidate) => classes.includes(candidate) && !processed.has(candidate));

          if (candidateClasses.length === mapping.expandsTo.length) {
            const compression = compressToShorthand(candidateClasses);
            if (compression) {
              const alreadyCovered = result.some((added) => {
                if (added === compression.compressed) return true;
                const addedExpanded = expandShorthandClass(added);
                const expandedSet = new Set(compression.expanded);
                return addedExpanded.every((c) => expandedSet.has(c));
              });

              if (!alreadyCovered) {
                result.push(compression.compressed);
                for (const expanded of compression.expanded) {
                  processed.add(expanded);
                }
                compressed = true;
                break;
              }
            }
          }
        }
      }
    }

    if (!compressed && !processed.has(cls)) {
      result.push(cls);
      processed.add(cls);
    }
  }

  return result;
}
