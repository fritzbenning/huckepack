export const isFirstCharUppercase = (str: string | undefined | null) => {
  if (!str || str.length === 0) {
    return false;
  }
  return str[0] === str[0].toUpperCase();
};
