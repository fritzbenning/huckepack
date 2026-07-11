import type { KeyboardShortcutConfig } from "../types";
import { matchesExcludedModifiers } from "../utils/matchesExcludedModifiers";
import { matchesRequiredModifiers } from "../utils/matchesRequiredModifiers";

export const matchesShortcut = (event: KeyboardEvent, shortcut: KeyboardShortcutConfig): boolean => {
  const keyMatches = shortcut.keys.some(
    (key) => key.toLowerCase() === event.key.toLowerCase() || key === event.key
  );

  if (!keyMatches) {
    return false;
  }

  return (
    matchesRequiredModifiers(event, shortcut.modifiers) &&
    matchesExcludedModifiers(event, shortcut.excludeModifiers)
  );
};

