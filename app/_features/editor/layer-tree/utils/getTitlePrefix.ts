export const getTitlePrefix = (classes: string[]) => {
  if (!classes || classes.length === 0) {
    return "";
  }

  // Modal-related prefixes
  if (classes.includes("modal") || classes.includes("dialog")) {
    return "Modal ";
  }

  if (classes.includes("overlay") || classes.includes("backdrop")) {
    return "Overlay ";
  }

  // Layout prefixes
  if (classes.includes("flex")) {
    return "Flex ";
  }

  if (classes.includes("grid")) {
    return "Grid ";
  }

  return "";
};
