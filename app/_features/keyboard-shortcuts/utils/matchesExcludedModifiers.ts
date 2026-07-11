import type { KeyboardShortcutConfig } from "../types";

export const matchesExcludedModifiers = (
  event: KeyboardEvent,
  excludeModifiers: KeyboardShortcutConfig["excludeModifiers"]
): boolean => {
  if (!excludeModifiers) {
    return true;
  }

  return (
    (!excludeModifiers.metaKey || !event.metaKey) &&
    (!excludeModifiers.ctrlKey || !event.ctrlKey) &&
    (!excludeModifiers.shiftKey || !event.shiftKey) &&
    (!excludeModifiers.altKey || !event.altKey)
  );
};

