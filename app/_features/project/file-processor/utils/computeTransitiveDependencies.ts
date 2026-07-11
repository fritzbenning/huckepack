export function computeTransitiveDependencies(
  rootFileIds: string[],
  dependencyGraph: Record<string, string[]>
): string[] {
  const visited = new Set<string>();
  const queue = [...rootFileIds];

  while (queue.length > 0) {
    const fileId = queue.shift()!;
    if (visited.has(fileId)) continue;

    visited.add(fileId);

    const dependencies = dependencyGraph[fileId] || [];
    dependencies.forEach((depId) => {
      if (!visited.has(depId)) {
        queue.push(depId);
      }
    });
  }

  return Array.from(visited);
}

