import { classifyBackgroundClass } from "./classifyBackgroundClass";

export function getBackgroundClassesByProperty(classTokens: string[], property: string): string[] {
  return classTokens.filter((cls) => classifyBackgroundClass(cls) === property);
}
