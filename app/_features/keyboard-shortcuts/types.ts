export interface KeyboardShortcutData {
  key: string;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  code: string;
}

export interface KeyboardShortcutConfig {
  id: string; // Unique identifier
  action: string; // Action identifier
  keys: string[]; // Key values to match
  modifiers?: {
    shiftKey?: boolean;
    metaKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
  };
  excludeModifiers?: {
    shiftKey?: boolean;
    metaKey?: boolean;
    ctrlKey?: boolean;
    altKey?: boolean;
  };
  // Optional metadata
  description?: string;
  category?: string;
  preventDefault?: boolean; // Default: true
  stopPropagation?: boolean; // Default: false
  // Context filtering
  excludeTargets?: string[]; // Tag names to exclude
  enabled?: () => boolean; // Dynamic enable/disable
}

export type ShortcutHandler = (
  shortcut: KeyboardShortcutConfig,
  event: KeyboardEvent | SyntheticKeyboardEvent
) => void | boolean;

export interface SyntheticKeyboardEvent extends KeyboardEvent {
  synthetic: true;
  originalData?: KeyboardShortcutData;
}

