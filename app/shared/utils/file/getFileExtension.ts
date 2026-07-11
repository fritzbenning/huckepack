export const getFileExtension = (path: string): string => {
  return path.split(".").pop()?.toLowerCase() || "tsx";
};

