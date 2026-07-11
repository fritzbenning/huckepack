import type { KeyboardShortcutConfig } from "../types";

export const matchesRequiredModifiers = (
  event: KeyboardEvent,
  modifiers: KeyboardShortcutConfig["modifiers"]
): boolean => {
  if (!modifiers) {
    return true;
  }

  if (modifiers.metaKey && modifiers.ctrlKey) {
    if (!event.metaKey && !event.ctrlKey) {
      return false;
    }
  } else {
    if (modifiers.metaKey && !event.metaKey) {
      return false;
    }
    if (modifiers.ctrlKey && !event.ctrlKey) {
      return false;
    }
  }

  if (modifiers.shiftKey && !event.shiftKey) {
    return false;
  }
  if (modifiers.altKey && !event.altKey) {
    return false;
  }

  return true;
};

