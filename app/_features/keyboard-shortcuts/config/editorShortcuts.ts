import type { KeyboardShortcutConfig } from "../types";

export const editorShortcuts: KeyboardShortcutConfig[] = [
  {
    id: "editor.deleteNode",
    action: "node.delete",
    keys: ["Backspace", "Delete"],
    description: "Delete the selected node",
    category: "editor",
    excludeTargets: ["INPUT", "TEXTAREA"],
  },
  {
    id: "editor.moveNodeUp",
    action: "node.move.up",
    keys: ["ArrowUp", "ArrowLeft"],
    description: "Move selected node up/left",
    category: "editor",
    excludeTargets: ["INPUT", "TEXTAREA"],
  },
  {
    id: "editor.moveNodeDown",
    action: "node.move.down",
    keys: ["ArrowDown", "ArrowRight"],
    description: "Move selected node down/right",
    category: "editor",
    excludeTargets: ["INPUT", "TEXTAREA"],
  },
  {
    id: "editor.toggleFocusMode",
    action: "canvas.toggleFocusMode",
    keys: ["."],
    modifiers: {
      metaKey: true,
    },
    description: "Toggle focus mode",
    category: "editor",
    excludeTargets: ["INPUT", "TEXTAREA"],
  },
  {
    id: "editor.undo",
    action: "history.undo",
    keys: ["z", "Z"],
    modifiers: {
      metaKey: true,
      ctrlKey: true,
    },
    description: "Undo last change",
    category: "editor",
    excludeTargets: ["INPUT", "TEXTAREA"],
  },
  {
    id: "editor.redo",
    action: "history.redo",
    keys: ["z", "Z"],
    modifiers: {
      metaKey: true,
      ctrlKey: true,
      shiftKey: true,
    },
    description: "Redo last undone change",
    category: "editor",
    excludeTargets: ["INPUT", "TEXTAREA"],
  },
  {
    id: "editor.spotlight",
    action: "spotlight.open",
    keys: ["k", "K", "p", "P"],
    modifiers: {
      metaKey: true,
      ctrlKey: true,
    },
    description: "Open spotlight search",
    category: "editor",
  },
];
