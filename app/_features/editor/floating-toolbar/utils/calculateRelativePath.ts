export function calculateRelativePath(fromPath: string, toPath: string): string {
  // Normalize paths
  const from = fromPath.startsWith("/") ? fromPath : `/${fromPath}`;
  const to = toPath.startsWith("/") ? toPath : `/${toPath}`;

  // Remove file extensions
  const fromWithoutExt = from.replace(/\.(tsx?|jsx?)$/, "");
  const toWithoutExt = to.replace(/\.(tsx?|jsx?)$/, "");

  // Split into segments
  const fromSegments = fromWithoutExt.split("/").filter(Boolean);
  const toSegments = toWithoutExt.split("/").filter(Boolean);

  // Remove filename from fromPath (keep directory)
  const fromDir = fromSegments.slice(0, -1);
  const toDir = toSegments.slice(0, -1);
  const toFileName = toSegments[toSegments.length - 1];

  // Find common path
  let commonLength = 0;
  const minLength = Math.min(fromDir.length, toDir.length);
  for (let i = 0; i < minLength; i++) {
    if (fromDir[i] === toDir[i]) {
      commonLength++;
    } else {
      break;
    }
  }

  // Calculate relative path
  const upLevels = fromDir.length - commonLength;
  const downPath = toDir.slice(commonLength);

  // Build relative path
  if (upLevels === 0 && downPath.length === 0) {
    // Same directory
    return `./${toFileName}`;
  }

  const upPath = upLevels > 0 ? "../".repeat(upLevels) : "";
  const downPathStr = downPath.length > 0 ? `${downPath.join("/")}/` : "";
  return `${upPath}${downPathStr}${toFileName}`;
}
