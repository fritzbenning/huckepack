/**
 * Gets the linked enum key for a given numeric value.
 * Returns the key from linkedValues Map that has the nearest value to currentValue, or null if no valid values.
 */
export function getLinkedEnumValue(currentValue: number, linkedValues: Map<string, number>): string | null {
  if (!Number.isFinite(currentValue)) return null;

  let nearestKey: string | null = null;
  let minDistance = Infinity;

  for (const [key, value] of linkedValues.entries()) {
    if (!Number.isFinite(value)) continue;

    const distance = Math.abs(currentValue - value);
    if (distance < minDistance) {
      minDistance = distance;
      nearestKey = key;
    }
  }

  return nearestKey;
}
