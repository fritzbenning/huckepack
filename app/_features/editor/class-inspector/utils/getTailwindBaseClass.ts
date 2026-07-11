import { HELPER_PREFIXES } from "../constants";

export function getTailwindBaseClass(token: string): string {
  let baseToken = token;

  for (const prefix of HELPER_PREFIXES) {
    if (baseToken.startsWith(prefix)) {
      baseToken = baseToken.slice(prefix.length);

      return getTailwindBaseClass(baseToken);
    }
  }

  return baseToken;
}
