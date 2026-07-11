import { classifyTextClass } from "./classifyTextClass";

export function getTextClassesByProperty(classTokens: string[], property: string): string[] {
  return classTokens.filter((cls) => classifyTextClass(cls) === property);
}
