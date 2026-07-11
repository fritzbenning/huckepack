export const shouldExcludeTarget = (target: HTMLElement, excludeTargets?: string[]): boolean => {
  if (!excludeTargets || excludeTargets.length === 0) {
    return false;
  }

  if (excludeTargets.includes(target.tagName)) {
    return true;
  }

  if (target.contentEditable === "true") {
    return true;
  }

  return false;
};

