import { compressClasses } from "./compressClasses";

export function optimizeOutputClasses(
  classesToAdd: string[],
  classesToRemove: string[],
  existingClasses: string[] = []
): { optimizedAdd: string[]; optimizedRemove: string[] } {
  const originalClassesSet = new Set(existingClasses);

  const workingClasses = new Set(existingClasses.filter((cls) => !classesToRemove.includes(cls)));

  for (const cls of classesToAdd) {
    workingClasses.add(cls);
  }

  const compressed = compressClasses(Array.from(workingClasses));
  const compressedSet = new Set(compressed);

  const toAdd = compressed.filter((cls) => !originalClassesSet.has(cls));
  const toRemove = existingClasses.filter((cls) => !compressedSet.has(cls));

  return {
    optimizedAdd: toAdd,
    optimizedRemove: toRemove,
  };
}
