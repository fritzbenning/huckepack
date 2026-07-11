export const extractInitials = (input: string | React.ReactNode): string => {
  const nameStr = typeof input === "string" ? input : String(input);

  const words = nameStr.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
};

