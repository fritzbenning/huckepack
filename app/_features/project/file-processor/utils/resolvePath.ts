export function resolvePath(basePath: string, relativePath: string): string {
  const baseSegments = basePath.split("/").filter(Boolean);
  const relativeSegments = relativePath.split("/").filter(Boolean);

  const result = baseSegments.slice(0, -1);

  for (const segment of relativeSegments) {
    if (segment === "..") {
      result.pop();
    } else if (segment !== ".") {
      result.push(segment);
    }
  }

  return `/${result.join("/")}`;
}

